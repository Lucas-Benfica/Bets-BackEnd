import { InvalidDataError } from "errors/InvalidDataError";
import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

export function validateSchema(schema : ObjectSchema){
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            throw InvalidDataError("The request must be made with a body.");
        }
          
        const validation = schema.validate(req.body);
        if(validation.error){
            return res.status(422).send({error: validation.error.message});
        }
        next();
    }
}