import { status_meja } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const addDataSchema = Joi.object({
    nomor_meja: Joi.string().min(0).required(),
    status_meja: Joi.string().valid("tersedia","taksedia").required()

})

const updateDataSchema = Joi.object({
    nomor_meja: Joi.string().optional(),
    status_meja: Joi.string().valid("tersedia", "taksedia").optional()

})


export const verifyAddMeja = (request: Request, response: Response, next: NextFunction) => {
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

export const verifyEditMeja = (request: Request, response: Response, next: NextFunction) => {
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
