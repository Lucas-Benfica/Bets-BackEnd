import { InvalidDataError } from "../errors/InvalidDataError";
import { NotFoundError } from "../errors/NotFoundError";
import betsRepository from "../repositories/betsRepository";
import gamesRepository from "../repositories/gamesRepository";
import participantsRepository from "../repositories/participantsRepository";
import { createBetsType } from "../schemas/betsSchema";

async function createBet(betInfo: createBetsType) {
    if(!betInfo) throw InvalidDataError("Bet information must be submitted.");

    const game = await gamesRepository.getGamesById(betInfo.gameId);
    if(!game) throw NotFoundError(`The game with id: ${betInfo.gameId} was not found.`);
    if(game.isFinished) throw InvalidDataError(`The game with id: ${betInfo.gameId} has already been completed.`);

    const participant = await participantsRepository.getParticipantsById(betInfo.participantId);
    if(!participant) throw NotFoundError(`The participant with id: ${betInfo.participantId} was not found.`);

    if(participant.balance < betInfo.amountBet) throw InvalidDataError(`
    The bet amount must be less than or equal to the participant's balance. Balance: ${participant.balance}, amountBet: ${betInfo.amountBet}.
    `)
    await participantsRepository.updateParticipant(participant.id, betInfo.amountBet);

    const result  = await betsRepository.createBet(betInfo);
    return result;
}

const betsService = {
    createBet
}

export default betsService;