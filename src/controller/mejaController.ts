import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ errorFormat: "pretty" });

// Create Meja
export const createMeja = async (req: Request, res: Response) => {
  const { nomor_meja, status_meja } = req.body;

  try {
    const meja = await prisma.meja.create({
      data: {
        nomor_meja,
        status_meja
      }
    });
    res.json(meja);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to create meja', error: error.message });
  }
};
export const updateMejaStatus = async (req: Request, res: Response) => {
  const { id_meja } = req.body;

  if (!id_meja) {
    console.log('Request body:', req.body);  // Debug: Check incoming body
    return res.status(400).json({ message: 'ID meja is required' });
  }

  try {
    const meja = await prisma.meja.update({
      where: { id_meja: Number(id_meja) }, // Ensure it's a number
      data: { status_meja: 'tersedia' }
    });

    res.json(meja);
  } catch (error: any) {
    console.error('Error saat update meja:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat update', error: error.message });
  }
};

// Get All Meja
export const getAllMeja = async (req: Request, res: Response) => {
  try {
    const meja = await prisma.meja.findMany();
    res.json(meja);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch mejas', error: error.message });
  }
};

// Get Meja by ID
export const getMejaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'ID meja is required' });
  }

  try {
    const meja = await prisma.meja.findUnique({
      where: { id_meja: parseInt(id) } // Ensure the ID is parsed as an integer
    });

    if (!meja) {
      return res.status(404).json({ message: 'Meja not found' });
    }

    res.json(meja);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch meja', error: error.message });
  }
};


// Update Meja
export const updateMeja = async (req: Request, res: Response) => {
  const { id_meja } = req.params;
  const { nomor_meja, status_meja } = req.body;

  try {
    const meja = await prisma.meja.update({
      where: { id_meja: parseInt(id_meja) },
      data: {
        nomor_meja,
        status_meja
      }
    });

    res.json(meja);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to update meja', error: error.message });
  }
};

// Delete Meja
export const deleteMeja = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.meja.delete({ where: { id_meja: parseInt(id) } });
    res.json({ message: 'Meja deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete meja', error: error.message });
  }
};





// // Create Meja (Admin only)
// export const createMeja = async (req: Request, res: Response) => {
//   const { nomor_meja } = req.body;

//   try {
//     const meja = await prisma.meja.create({
//       data: {
//         nomor_meja,
//         status_meja: "tersedia", // Default status
//       },
//     });
//     res.json(meja);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating table", error });
//   }
// };

// // Get All Meja
// export const getAllMeja = async (req: Request, res: Response) => {
//   try {
//     const meja = await prisma.meja.findMany();
//     res.json(meja);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching tables", error });
//   }
// };

// // Get Meja by ID
// export const getMejaById = async (req: Request, res: Response) => {
//   const { id_meja } = req.params;

//   try {
//     const meja = await prisma.meja.findUnique({
//       where: { id_meja: Number(id_meja) },
//     });
//     if (!meja) {
//       return res.status(404).json({ message: "Table not found" });
//     }
//     res.json(meja);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching table", error });
//   }
// };

// // Update Meja (Admin only)
// export const updateMeja = async (req: Request, res: Response) => {
//   const { id_meja } = req.params;
//   const { nomor_meja, status_meja } = req.body;

//   try {
//     const updatedMeja = await prisma.meja.update({
//       where: { id_meja: Number(id_meja) },
//       data: { nomor_meja, status_meja },
//     });
//     res.json(updatedMeja);
//   } catch (error) {
//     res.status(500).json({ message: "Error updating table", error });
//   }
// };

// // Delete Meja (Admin only)
// export const deleteMeja = async (req: Request, res: Response) => {
//   const { id_meja } = req.params;

//   try {
//     await prisma.meja.delete({
//       where: { id_meja: Number(id_meja) },
//     });
//     res.json({ message: "Table deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting table", error });
//   }
// };

// // Create Transaksi (Set Meja to "taksedia")
// export const createTransaksi = async (req: Request, res: Response) => {
//   const { id_meja, id_user, nama_pelanggan, total_bayar } = req.body;

//   try {
//     // Cek apakah meja tersedia
//     const meja = await prisma.meja.findUnique({
//       where: { id_meja: Number(id_meja) },
//     });

//     if (!meja || meja.status_meja === "taksedia") {
//       return res.status(400).json({ message: "Meja tidak tersedia" });
//     }

//     // Buat transaksi dan ubah status meja jadi 'taksedia'
//     const transaksi = await prisma.transaksi.create({
//       data: {
//         id_meja: Number(id_meja),
//         id_user: Number(id_user),
//         nama_pelanggan,
//         total_bayar: Number(total_bayar),
//         status: "belum", // Status awal transaksi
//       },
//     });

//     await prisma.meja.update({
//       where: { id_meja: Number(id_meja) },
//       data: { status_meja: "taksedia" },
//     });

//     res.status(201).json({ message: "Transaksi berhasil dibuat", transaksi });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating transaction", error });
//   }
// };

// // Update Status Transaksi (Set Meja to "tersedia" if "lunas")
// export const updateTransaksiStatus = async (req: Request, res: Response) => {
//   const { id_transaksi } = req.params;
//   const { status } = req.body;

//   try {
//     const transaksi = await prisma.transaksi.update({
//       where: { id_transaksi: Number(id_transaksi) },
//       data: { status },
//     });

//     // Jika transaksi lunas, ubah status meja ke 'tersedia'
//     if (status === "lunas") {
//       await prisma.meja.update({
//         where: { id_meja: transaksi.id_meja },
//         data: { status_meja: "tersedia" },
//       });
//     }

//     res.json({ message: "Status transaksi diperbarui", transaksi });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating transaction status", error });
//   }
// };
// Create Meja