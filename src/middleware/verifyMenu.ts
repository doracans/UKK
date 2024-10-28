import { NextFunction, Request, Response } from "express";
import Joi, { string } from "joi";

const addDataSchema = Joi.object({
    nama_menu: Joi.string().required(),
    jenis: Joi.string().valid("makanan","minuman"),
    deskripsi: Joi.string().required(),
    gambar:Joi.allow().optional(),
    stok: Joi.number().min(0).required(),
    harga: Joi.number().min(0).required()
})

const updateDataSchema = Joi.object({
    nama_menu: string().optional(),
    jenis: Joi.string().valid("makanan","minuman"),
    deskripsi: string().optional(),
    gambar: Joi.allow().optional(),
    stok: Joi.number().optional(),
    harga: Joi.number().optional()
})


export const verifyAddCoffee = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = addDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        /** if there is an error, then give a response like this */
        return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
       })
   }
    return next()
}

export const verifyEditCoffee = (request: Request, response: Response, next: NextFunction) => {
    /** validate a request body and grab error if exist */
    const { error } = updateDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
       /** if there is an error, then give a response like this */
       return response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
   }
    return next()
}