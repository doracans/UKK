import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import md5 from "md5";
import { sign } from "jsonwebtoken"
import { request } from "http";

const prisma = new PrismaClient({ errorFormat: "pretty" })

// Login User

// Create User (Admin only)
export const createUser = async (req: Request, res: Response) => {
    const { nama_user, role, username, password } = req.body;

    try {
        const newUser = await prisma.user.create({
            data: {
                nama_user,
                role,
                username,
                password: md5(password)
            }
        });
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
};

// Get All Users (Admin only)
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// Get User by ID (Admin only)
export const getUserById = async (req: Request, res: Response) => {
    const { id_user } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id_user: Number(id_user) }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
};

// Update User (Admin only)
export const updateUser = async (req: Request, res: Response) => {
    const { id_user } = req.params;
    const { nama_user, role, username, password } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id_user: Number(id_user) },
            data: {
                nama_user,
                role,
                username,
                password: password ? md5(password) : undefined
            }
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
};

// Delete User (Admin only)
export const deleteUser = async (req: Request, res: Response) => {
    const { id_user } = req.params;
    try {
        await prisma.user.delete({
            where: { id_user: Number(id_user) }
        });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
}
export const authentication = async (request: Request, response: Response) => {
    try {
        const { username, password } = request.body; /** Ambil data dari request body */

        /** Cari user berdasarkan username dan password yang telah di-hash */
        const findUser = await prisma.user.findFirst({
            where: { 
                username, 
                password: md5(password) // pastikan password sudah ter-hash dengan benar
            }
        });

        /** Jika user tidak ditemukan */
        if (!findUser) {
            return response
                .status(401) // set status code jadi 401 untuk autentikasi yang gagal
                .json({ status: false, logged: false, message: 'Username or password is invalid' });
        }

        /** Jika user ditemukan, siapkan payload untuk token */
        const payload = { id: findUser.id_user, username: findUser.username, role: findUser.role };

        /** Ambil secret key dari environment atau gunakan default */
        const secretKey = process.env.JWT_SECRET_KEY || 'dorakuy';

        /** Buat token menggunakan payload dan secretKey */
        const token = sign(payload, secretKey, { expiresIn: '1h' }); // contoh durasi token: 1 jam

        /** Kirimkan respons berhasil dengan token */
        return response
            .status(200)
            .json({ status: true, logged: true, message: 'Login Success', token });
    } catch (error) {
        /** Tangani error jika ada */
        return response
            .status(500) // status code untuk error server
            .json({ status: false, message: `There was an error: ${error}` });
    }
};