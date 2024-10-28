
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

/** Schema untuk menambahkan pengguna baru */
const addDataSchema = Joi.object({
    nama_user: Joi.string().required(),
    role: Joi.string().valid("manajer", "kasir", "admin").required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
});

/** Schema untuk mengedit pengguna */
const updateDataSchema = Joi.object({
    nama_user: Joi.string().optional(),
    role: Joi.string().valid("manajer", "kasir", "admin").optional(),
    username: Joi.string().optional(),
    password: Joi.string().optional(),
});

/** Schema untuk autentikasi */
const authSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

/** Middleware untuk memverifikasi data penambahan pengguna */
export const verifyAddUser = (req: Request, res: Response, next: NextFunction) => {
    const { error } = addDataSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(detail => detail.message).join(', '),
        });
    }
    next();
};

/** Middleware untuk memverifikasi data pengeditan pengguna */
export const verifyEditUser = (req: Request, res: Response, next: NextFunction) => {
    const { error } = updateDataSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(detail => detail.message).join(', '),
        });
    }
    next();
};

/** Middleware untuk memverifikasi data autentikasi */
export const verifyAuthentication = (req: Request, res: Response, next: NextFunction) => {
    const { error } = authSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            status: false,
            message: error.details.map(detail => detail.message).join(', '),
        });
    }
    next();
};
