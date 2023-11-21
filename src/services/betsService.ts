import { InvalidDataError } from "../errors/InvalidDataError";
import { NotFoundError } from "../errors/NotFoundError";
import betsRepository from "../repositories/betsRepository";
import gamesRepository from "../repositories/gamesRepository";
import participantsRepository from "../repositories/participantsRepository";
import { createBetsType } from "../schemas/betsSchema";

async function createBet(betInfo: createBetsType) {
    if(!betInfo) throw InvalidDataError("Bet information must be submitted.");
    if(betInfo.amountBet <= 0 ) throw InvalidDataError("The bet must be greater than 0.");
    const { gameId, participantId } = betInfo;
    const game = await gamesRepository.getGamesById(gameId);
    console.log("game ta aqui existe", game);
    if(!game) throw NotFoundError(`The game with id: ${gameId} was not found.`);
    if(game.isFinished) throw InvalidDataError(`The game with id: ${gameId} has already been completed.`);
    const participant = await participantsRepository.getParticipantsById(participantId);
    if(!participant) throw NotFoundError(`The participant with id: ${participantId} was not found.`);
    if(participant.balance < betInfo.amountBet) throw InvalidDataError(`
    The bet amount must be less than or equal to the participant's balance. Balance: ${participant.balance}, amountBet: ${betInfo.amountBet}.
    `)
    await participantsRepository.updateParticipant(participant.id, betInfo.amountBet);
    return await betsRepository.createBet(betInfo);
}

const betsService = {
    createBet
}

export default betsService;