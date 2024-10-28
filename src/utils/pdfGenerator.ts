import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

// Fungsi untuk membuat PDF dari data transaksi
export const generatePDF = async (data: any) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 500]); // Atur ukuran PDF
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let yPosition = height - 50; // Posisi awal untuk menulis
  const lineSpacing = 20; // Jarak antar baris

  // Fungsi untuk menggambar teks
  const addText = (text: string, size = 12) => {
    page.drawText(text, { x: 50, y: yPosition, size, font, color: rgb(0, 0, 0) });
    yPosition -= lineSpacing;
  };

  // Fungsi untuk menggambar garis horizontal
  const drawLine = (y: number) => {
    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
  };

  // Header: Nama Caffe
  addText('Dora Caffe', 18);
  yPosition -= lineSpacing;

  // Tambahkan judul kuitansi
  addText('Kuitansi Transaksi', 16);
  yPosition -= lineSpacing;
  drawLine(yPosition); // Garis setelah judul
  yPosition -= lineSpacing;

  // Informasi transaksi
  addText(`ID Transaksi: ${data.id_transaksi}`);
  addText(`Tanggal: ${data.tgl_transaksi}`);
  addText(`Nama Pelanggan: ${data.nama_pelanggan}`);
  addText(`Nomor Meja: ${data.id_meja}`);
  addText(`Status: ${data.status}`);
  addText(`Kasir: ${data.user?.nama_user || 'Tidak diketahui'}`); // Tambahkan nama_user dari user relasi
  yPosition -= lineSpacing;
  drawLine(yPosition); // Garis pemisah sebelum detail pesanan
  yPosition -= lineSpacing;

  // Detail pesanan
  addText('Detail Pesanan:', 14);
  data.detail_transaksi.forEach((detail: any) => {
    const itemText = `${detail.menu?.nama_menu || 'Menu'} - ${detail.quantity} x IDR ${detail.harga}`;
    addText(itemText);
  });

  yPosition -= lineSpacing;
  drawLine(yPosition); // Garis pemisah sebelum total
  yPosition -= lineSpacing;

  // Total pembayaran
  addText(`Total Pembayaran: IDR ${data.total_bayar}`, 14);
  yPosition -= lineSpacing * 2;

  // Pesan penutup
  addText('Terima kasih telah berkunjung!', 12);
  drawLine(yPosition); // Garis penutup
  yPosition -= lineSpacing;

  // Simpan PDF
  const pdfBytes = await pdfDoc.save();
  const receiptsDir = path.join(__dirname, '../receipts');

  // Buat folder jika belum ada
  if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir, { recursive: true });
  }

  const pdfPath = path.resolve(receiptsDir, `kuitansi_${data.id_transaksi}.pdf`);
  fs.writeFileSync(pdfPath, pdfBytes);

  return pdfPath;
};
