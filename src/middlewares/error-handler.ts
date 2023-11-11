import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ApplicationError, RequestError } from "utils/protocols";

export function handleApplicationErrors(
    err: RequestError | ApplicationError | Error,
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    console.log(err);
    if (err.name === 'ConflictError') {
        return res.status(httpStatus.CONFLICT).send({
            message: err.message,
        });
    }

    if (err.name === 'InvalidDataError') {
        return res.status(httpStatus.BAD_REQUEST).send({
            message: err.message,
        });
    }

    if (err.name === 'NotFoundError') {
        return res.status(httpStatus.NOT_FOUND).send({
            message: err.message,
        });
    }

    if (err.name === 'UnauthorizedError') {
        return res.status(httpStatus.UNAUTHORIZED).send({
            message: err.message,
        });
    }

    if (err.hasOwnProperty('status') && err.name === 'RequestError') {
        return res.status((err as RequestError).status).send({
            message: err.message,
        });
    }

    console.error(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        error: 'InternalServerError',
        message: 'Internal Server Error',
    });
}