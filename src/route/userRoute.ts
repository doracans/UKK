import express from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, authentication } from '../controller/userController';
import authMiddleware from '../middleware/authMiddelware';
import { verifyAuthentication, verifyAddUser, verifyEditUser } from '../middleware/verifyUser';

const router = express.Router();

router.get('/', authMiddleware(['admin']), getAllUsers); // Get all users (Admin only)
router.post('/', authMiddleware(['admin']), verifyAddUser, createUser); // Create user (Admin only)
router.get('/:id_user', authMiddleware(['admin']), getUserById); // Get user by ID (Admin only)
router.put('/:id_user', authMiddleware(['admin']), verifyEditUser, updateUser); // Update user (Admin only)
router.delete('/:id_user', authMiddleware(['admin']), deleteUser); // Delete user (Admin only)

// Authentication (Login) - Available to all roles
router.post('/auth', verifyAuthentication, authentication);

export default router;
