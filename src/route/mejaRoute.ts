import { Router } from 'express';
import { createMeja, getAllMeja, getMejaById, updateMejaStatus, updateMeja, deleteMeja } from '../controller/mejaController';
import authMiddleware from '../middleware/authMiddelware';
import { verifyAddMeja, verifyEditMeja } from '../middleware/verifyMeja';

const router = Router();

router.post('/', authMiddleware(['admin']), verifyAddMeja, createMeja); // Create Meja (Admin only)
router.get('/', authMiddleware(['kasir', 'manajer', 'admin']), getAllMeja); // Read All Meja (All roles)
router.get('/:id_meja', authMiddleware(['kasir', 'manajer', 'admin']), getMejaById); // Read Meja By ID (All roles)
router.put('/:id_meja', authMiddleware(['admin']), verifyEditMeja, updateMeja); // Update Meja (Admin only)
router.delete('/:id_meja', authMiddleware(['admin']), deleteMeja); // Delete Meja (Admin only)
router.put('/update-status/:id', authMiddleware(['admin']), updateMejaStatus); // Update Status (Admin only)

export default router;
