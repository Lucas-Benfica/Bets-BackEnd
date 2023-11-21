import { Bet, Game } from "@prisma/client";
import prisma from "database/database";
import { InvalidDataError } from "errors/InvalidDataError";
import { NotFoundError } from "errors/NotFoundError";
import betsRepository from "repositories/betsRepository";
import gamesRepository from "repositories/gamesRepository";
import participantsRepository from "repositories/participantsRepository";
import { createGamesType } from "schemas/gamesSchema";

async function createGame(gameData: createGamesType): Promise<Game> {
    if(!gameData) throw InvalidDataError("Game information must be submitted.");

    return await gamesRepository.createGame(gameData);
}

async function getGames(): Promise<Game[]>{
    return await gamesRepository.getGames();
}

async function getGamesById(gameId: number): Promise<Game>{
    const game = await gamesRepository.getGamesById(gameId); 

    if(!game) throw NotFoundError("The game with this id does not exist.");

    return game;
}

async function finishGame(gameId: number, homeTeamScore: number, awayTeamScore: number): Promise<Game> {
    const gameExists = await gamesRepository.getGamesById(gameId);
    if(!gameExists) throw NotFoundError("The game with this id does not exist.");
    if(gameExists.isFinished) throw InvalidDataError(`The game with ID=${gameExists.id} is already finished`);
    const game = await gamesRepository.finishGame(gameId, homeTeamScore, awayTeamScore);
    const bets = game.bets;
    if(bets.length === 0) return game;

    let {betsAfterGame, betsParticipants} = updateStatus(bets, homeTeamScore, awayTeamScore);

    await betsRepository.finishBets(betsAfterGame);
    await participantsRepository.resultOfParticipantsBets(betsParticipants);

    return await gamesRepository.getGamesById(game.id);
}

function updateStatus(bets: Bet[], homeTeamScore: number, awayTeamScore: number){
    let sumOfBetsWon = 0, sumOfAllBets = 0;
    const betsWithNewStatus = bets.map( bet => {
        let newStatus = "PENDING";
        sumOfAllBets += bet.amountBet;
        if(bet.homeTeamScore === homeTeamScore && bet.awayTeamScore === awayTeamScore){
            newStatus = "WON";
            sumOfBetsWon += bet.amountBet;
        }
        else{
            newStatus = "LOST";
        }
        return {
            ...bet, status: newStatus,
        }
    });
    const {betsAfterGame, betsParticipants} = updateAmountWon(betsWithNewStatus, sumOfBetsWon, sumOfAllBets);
    return {betsAfterGame, betsParticipants};
} 

function updateAmountWon(bets: Bet[], sumOfBetsWon:number, sumOfAllBets: number){
    const betsParticipants = [];
    const betsAfterGame = bets.map( bet => {
        let newAmount = 0;
        if(bet.status === "LOST"){
            betsParticipants.push({id: bet.participantId, amountWon: 0});
            return { ...bet, amountWon: 0 }
        }
        else if(bet.status === "WON"){
            newAmount = Math.floor((bet.amountBet / sumOfBetsWon) * (sumOfAllBets) * (1 - 0.3));
            betsParticipants.push({id: bet.participantId, amountWon: newAmount});
            return {
                ...bet,
                amountWon: newAmount
            }
        }
    })
    return {betsAfterGame, betsParticipants};
}

const gamesService = {
    createGame, getGames, getGamesById, finishGame
};

export default gamesService;