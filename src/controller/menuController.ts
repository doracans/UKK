import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { BASE_URL } from "../global";

const prisma = new PrismaClient({ errorFormat: "pretty" });

// Create Menu (Admin only)
export const createMenu = async (req: Request, res: Response) => {
  try {
    const { nama_menu, jenis, deskripsi, stok, harga } = req.body;

    let filename = "";
    if (req.file) filename = req.file.filename; /** get file name of uploaded file */

    const menu = await prisma.menu.create({
      data: { 
        nama_menu, 
        jenis, 
        deskripsi, 
        stok:Number(stok),
        harga:Number(harga), 
        gambar: filename 
      }
    });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error creating menu' });
  }
};

// Get All Menu
export const getAllMenu = async (req: Request, res: Response) => {
  try {
    const menu = await prisma.menu.findMany();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu' });
  }
};

// Get Menu by ID
export const getMenuById = async (req: Request, res: Response) => {
  const { id_menu } = req.params;

  try {
    const menu = await prisma.menu.findUnique({
      where: { id_menu: Number(id_menu) }
    });
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu' });
  }
};

// Update Menu (Admin only)
export const updateMenu = async (req: Request, res: Response) => {
  const { id_menu } = req.params; /** Ambil ID menu dari parameter URL */
  const { nama_menu, jenis, deskripsi, stok, harga } = req.body; /** Ambil data dari request body */

  try {
    /** Pastikan data menu ada di database */
    const findMenu = await prisma.menu.findFirst({ where: { id_menu: Number(id_menu) } });
    if (!findMenu) {
      return res.status(404).json({ status: false, message: "Menu not found" });
    }

    let filename = findMenu.gambar; /** Set nilai default gambar dari data yang ada */
    if (req.file) {
      filename = req.file.filename;

      /** Hapus file lama jika ada */
      let path = `${BASE_URL}/public/coffee-image/${findMenu.gambar}`;
      if (fs.existsSync(path) && findMenu.gambar !== "") {
        fs.unlinkSync(path);
      }
    }

    /** Proses update menu */
    const updatedMenu = await prisma.menu.update({
      where: { id_menu: Number(id_menu) },
      data: {
        nama_menu: nama_menu || findMenu.nama_menu,
        jenis: jenis || findMenu.jenis,
        deskripsi: deskripsi || findMenu.deskripsi,
        stok: stok ? Number(stok) : findMenu.stok,
        harga: harga ? Number(harga) : findMenu.harga,
        gambar: filename,
      },
    });

    return res.status(200).json({
      status: true,
      data: updatedMenu,
      message: "Menu has been updated",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `There is an error. ${error}`,
    });
  }
};

// Delete Menu (Admin only)
export const deleteMenu = async (req: Request, res: Response) => {
  const { id_menu } = req.params;

  try {
    const findMenu = await prisma.menu.findFirst({ where: { id_menu: Number(id_menu) } });
    if (!findMenu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    /** prepare to delete file of deleted menu's data */
    let path = `${BASE_URL}/public/coffee-image/${findMenu.gambar}`; /** define path (address) of file location */
    let exists = fs.existsSync(path);
    if (exists && findMenu.gambar !== '') {
      fs.unlinkSync(path); /** if file exists, then delete it */
    }

    await prisma.menu.delete({
      where: { id_menu: Number(id_menu) }
    });
    res.json({ message: 'Menu deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu' });
  }
};
