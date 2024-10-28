import { Router } from 'express';
import { createTransaksi, getAllTransaksi, getTransaksiById, updateTransaksi, deleteTransaksi, printTransaksi } from '../controller/transaksiController';
import authMiddleware from '../middleware/authMiddelware';
import { verifyAddOrder, verifyUpdateOrder } from '../middleware/verifyTransaksi';

const router = Router();

// Cashier role can create and update transactions
router.post('/', authMiddleware(['kasir']), verifyAddOrder,createTransaksi); // Create Order (Cashier only)
router.put('/:id_transaksi', authMiddleware(['kasir']), verifyUpdateOrder, updateTransaksi); // Update Order (Cashier only)
router.delete('/:id_transaksi', authMiddleware(['kasir']), deleteTransaksi); // Delete Order (Cashier only)
router.get('/:id_transaksi/print', authMiddleware(['kasir']), printTransaksi); // Print transaction note (Cashier only)

// Manager and admin roles can view all transactions
router.get('/', authMiddleware(['manajer', 'admin']), getAllTransaksi); // Read all transactions (Manager/Admin)
router.get('/show', authMiddleware(['kasir']), getAllTransaksi); // Read all transactions (Manager/Admin)
router.get('/:id_transaksi', authMiddleware(['manajer', 'admin','kasir']), getTransaksiById); // Read transaction by ID (Manager/Admin)

export default router;
