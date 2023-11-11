import { Request, Response } from "express";
import httpStatus from "http-status";
import participantsService from "services/participantsService";

async function createParticipant(req: Request, res: Response) {
    const newParticipant = await participantsService.createParticipant(req.body);
    res.status(httpStatus.CREATED).send(newParticipant);
}

async function getParticipants(req: Request, res: Response) {
    const participants = await participantsService.getParticipants();
    res.status(httpStatus.OK).send(participants);
}

const participantsController = {
    createParticipant, getParticipants
}

export default participantsController;
