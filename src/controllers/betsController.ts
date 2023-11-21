import { Request, Response } from "express";
import httpStatus from "http-status";
import betsService from "../services/betsService";

async function createBet(req: Request, res: Response) {
    const newBet = await betsService.createBet(req.body);
    res.status(httpStatus.CREATED).send(newBet);
}

const betsController = {
    createBet
}

export default betsController;
