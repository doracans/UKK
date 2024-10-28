import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

// Schema for validating individual transaction details when adding a new order (without id_transaksi)
const addDetailTransaksiSchema = Joi.object({
    id_menu: Joi.number().required(),
    harga: Joi.number().required(),
    quantity: Joi.number().required(),
});

// Schema for validating individual transaction details when updating an order (with optional id_transaksi)
const updateDetailTransaksiSchema = Joi.object({
    id_transaksi: Joi.number().optional(),
    id_menu: Joi.number().required(),
    harga: Joi.number().required(),
    quantity: Joi.number().required(),
});

// Schema for adding new order data (all fields required)
const addDataSchema = Joi.object({
    tgl_transaksi: Joi.string().required(),
    id_user: Joi.number().required(),
    id_meja: Joi.number().required(),
    nama_pelanggan: Joi.string().required(),
    status: Joi.string().valid("lunas", "belum"),
    detail_transaksi: Joi.array().items(addDetailTransaksiSchema).min(1).required()
});

// Schema for updating order data (fields are optional)
const updateDataSchema = Joi.object({
    tgl_transaksi: Joi.string().optional(),
    id_user: Joi.number().optional(),
    id_meja: Joi.number().optional(),
    nama_pelanggan: Joi.string().optional(),
    status: Joi.string().valid("lunas", "belum").optional(),
    detail_transaksi: Joi.array().items(updateDetailTransaksiSchema).optional()
});

/** Middleware to validate adding a new order */
export const verifyAddOrder = (request: Request, response: Response, next: NextFunction) => {
    const { error } = addDataSchema.validate(request.body, { abortEarly: false });

    if (error) {
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join(', ')
        });
    }
    next();
};

/** Middleware to validate updating an order */
export const verifyUpdateOrder = (request: Request, response: Response, next: NextFunction) => {
    const { error } = updateDataSchema.validate(request.body, { abortEarly: false });

    if (error) {
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join(', ')
        });
    }
    next();
};
