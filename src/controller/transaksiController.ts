import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { generatePDF } from '../utils/pdfGenerator';
import fs from 'fs';

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const createTransaksi = async (req: Request, res: Response) => {
  const { id_user, id_meja, tgl_transaksi, nama_pelanggan, status, detail_transaksi } = req.body;

  try {
    // Cek apakah meja masih tersedia
    const meja = await prisma.meja.findUnique({
      where: { id_meja },
    });

    if (!meja) {
      return res.status(404).json({ message: 'Meja tidak ditemukan' });
    }

    // Jika meja sudah taksedia, maka transaksi tidak bisa dilakukan
    if (meja.status_meja === 'taksedia') {
      return res.status(400).json({ message: 'Meja sudah dipesan' });
    }

    let total_bayar = 0;

    // Ambil harga dari menu dan hitung total bayar
    const detailWithHarga = await Promise.all(
      detail_transaksi.map(async (detail: { id_menu: number, quantity: number }) => {
        const menu = await prisma.menu.findUnique({
          where: { id_menu: detail.id_menu }
        });

        if (!menu) {
          throw new Error(`Menu dengan ID ${detail.id_menu} tidak ditemukan`);
        }

        const harga = menu.harga;
        const subtotal = harga * detail.quantity;
        total_bayar += subtotal;

        return {
          id_menu: detail.id_menu,
          harga,
          quantity: detail.quantity
        };
      })
    );

    // Kurangi stok untuk setiap item menu
    for (const detail of detailWithHarga) {
      await prisma.menu.update({
        where: { id_menu: detail.id_menu },
        data: { stok: { decrement: detail.quantity } } // Kurangi stok
      });
    }

    // Buat transaksi
    const transaksi = await prisma.transaksi.create({
      data: {
        id_user,
        id_meja,
        tgl_transaksi,
        nama_pelanggan,
        status,
        total_bayar, // Simpan total bayar ke transaksi
        detail_transaksi: {
          create: detailWithHarga.map(detail => ({
            id_menu: detail.id_menu,
            harga: detail.harga,
            quantity: detail.quantity
          }))
        }
      }
    });

    // Ubah status meja menjadi "taksedia"
    await prisma.meja.update({
      where: { id_meja },
      data: { status_meja: 'taksedia' }
    });

    res.json(transaksi);
  } catch (error) {
    console.error('Error saat membuat transaksi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat membuat transaksi' });
  }
};




// Get All Transaksi (Kasir & Manajer only)
export const getAllTransaksi = async (req: Request, res: Response) => {

  try {
    const {filter} = req.query
    const transaksi = await prisma.transaksi.findMany({
      where: {
       OR:[
        {tgl_transaksi:{contains: filter?.toString() || ""}},
       ]
      },
      orderBy: { tgl_transaksi: "desc" }, // Sort by transaction date descending
      include: {
        detail_transaksi: true,
        user: true, // Include user relation
        meja_id: true, // Include table relation
      },
    });
    res.json(transaksi);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

// Get Transaksi by ID (Kasir & Manajer only)
export const getTransaksiById = async (req: Request, res: Response) => {
  const { id_transaksi } = req.params;

  try {
    const transaksi = await prisma.transaksi.findUnique({
      where: { id_transaksi: Number(id_transaksi) },
      include: {
        detail_transaksi: true,
        user: true, // Menggunakan relasi user
        meja_id: true // Menggunakan relasi meja
      }
    });
    if (!transaksi) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaksi);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: 'Error fetching transaction' });
  }
};

// Update Transaksi (Kasir only)
export const updateTransaksi = async (req: Request, res: Response) => {
  const { id_transaksi } = req.params;
  const { tgl_transaksi,id_user,id_meja,nama_pelanggan, status, detail_transaksi } = req.body;

  try {
    // Fetch existing transaction details
    const existingTransaksi = await prisma.transaksi.findUnique({
      where: { id_transaksi: Number(id_transaksi) },
      include: { detail_transaksi: true },
    });

    if (!existingTransaksi) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    let total_bayar = 0;

    // Handle stock adjustments if new details are provided
    if (detail_transaksi) {
      // Restore stock from old transaction details
      for (const oldDetail of existingTransaksi.detail_transaksi) {
        await prisma.menu.update({
          where: { id_menu: oldDetail.id_menu },
          data: { stok: { increment: oldDetail.quantity } },
        });
      }

      // Adjust stock and calculate total_bayar for new transaction details
      for (const newDetail of detail_transaksi) {
        const menu = await prisma.menu.findUnique({
          where: { id_menu: newDetail.id_menu },
        });

        if (!menu) {
          return res.status(404).json({ message: `Menu with ID ${newDetail.id_menu} not found` });
        }

        if (menu.stok < newDetail.quantity) {
          return res.status(400).json({ message: `Insufficient stock for menu ${menu.nama_menu}` });
        }

        // Update stock for the new details
        await prisma.menu.update({
          where: { id_menu: newDetail.id_menu },
          data: { stok: { decrement: newDetail.quantity } },
        });

        // Calculate subtotal for each detail and update total_bayar
        const subtotal = menu.harga * newDetail.quantity;
        total_bayar += subtotal;
      }
    } else {
      // Use existing total_bayar if no new details are provided
      total_bayar = existingTransaksi.total_bayar;
    }

    // Update transaction
    const updatedTransaksi = await prisma.transaksi.update({
      where: { id_transaksi: Number(id_transaksi) },
      data: {
        tgl_transaksi,
        id_user,
        id_meja,
        nama_pelanggan,
        status,
        total_bayar,
        detail_transaksi: detail_transaksi
          ? {
              deleteMany: {}, // Delete existing details
              create: detail_transaksi.map((detail: any) => ({
                id_menu: detail.id_menu,
                harga: detail.harga,
                quantity: detail.quantity,
              })),
            }
          : undefined, // Only update if new details are provided
      },
      include: { detail_transaksi: true },
    });

    res.json(updatedTransaksi);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Error updating transaction" });
  }
};
// Delete Transaksi (Kasir only)
export const deleteTransaksi = async (req: Request, res: Response) => {
  const { id_transaksi } = req.params;

  try {
    // Hapus semua detail transaksi terkait sebelum menghapus transaksi
    await prisma.detail_transaksi.deleteMany({
      where: { id_transaksi: Number(id_transaksi) }
    });

    // Hapus transaksi utama
    await prisma.transaksi.delete({
      where: { id_transaksi: Number(id_transaksi) }
    });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Error deleting transaction' });
  }
};


export const printTransaksi = async (req: Request, res: Response) => {
  const { id_transaksi } = req.params;

  try {
    const transaksi = await prisma.transaksi.findUnique({
      where: { id_transaksi: Number(id_transaksi) },
      include: {
        detail_transaksi: { include: { menu: true } },
        user: true, // Memastikan relasi user diambil untuk mendapatkan nama_user
      },
    });    

    // Cek apakah transaksi ditemukan
    if (!transaksi) {
      return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
    }

    // Cek status transaksi
    if (transaksi.status === 'belum') {
      return res.status(400).json({ message: 'Transaksi dengan status "belum" tidak dapat dicetak.' });
    }

    // Generate PDF jika status bukan "belum"
    const pdfPath = await generatePDF(transaksi);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=kuitansi_${id_transaksi}.pdf`);

    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error saat membuat PDF:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat membuat PDF' });
  }
};
