import express from "express";
import { createMenu, updateMenu, deleteMenu, getAllMenu, getMenuById } from '../controller/menuController';
import uploadFile from "../middleware/uploadImageOfCoffe";
import authMiddleware from '../middleware/authMiddelware';

const router = express.Router();

router.post("/", authMiddleware(['admin']), uploadFile.single("gambar"), createMenu); // Add Menu (Admin only)
router.put("/:id_menu", authMiddleware(['admin']), uploadFile.single("gambar"), updateMenu); // Update Menu (Admin only)
router.get("/", authMiddleware(['kasir', 'manajer', 'admin']), getAllMenu); // View all menu items (All roles)
router.get("/:id_menu", authMiddleware(['kasir', 'manajer', 'admin']), getMenuById); // View menu by ID (All roles)
router.delete("/:id_menu", authMiddleware(['admin']), deleteMenu); // Delete Menu (Admin only)

export default router;
