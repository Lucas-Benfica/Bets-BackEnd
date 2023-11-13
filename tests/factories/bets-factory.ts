import { Bet } from "@prisma/client";
import prisma from "../../src/database/database";
import { faker } from '@faker-js/faker';
import { createBetsType } from "schemas/betsSchema";
import participantsRepository from "../../src/repositories/participantsRepository";

export function createBetInfo(gameId: number, participantId: number, amountBet: number = 1000): createBetsType {
    return {
        homeTeamScore: faker.number.int({ min: 0, max: 2 }),
	    awayTeamScore: faker.number.int({ min: 0, max: 2 }), 
	    amountBet: amountBet,
	    gameId: gameId,
	    participantId: participantId,
    }
}
export async function createBet(gameId: number, participantId: number): Promise<Bet> {
    await participantsRepository.updateParticipant(participantId, 1000);
    return await prisma.bet.create({
        data: {
            homeTeamScore: faker.number.int({ min: 0, max: 2 }),
	        awayTeamScore: faker.number.int({ min: 0, max: 2 }), 
	        amountBet: 1000,
	        gameId: gameId,
	        participantId: participantId,
        }
    })
}
export function createBetInfo2(gameId: number, participantId: number,amountBet: number, home: number, away: number): createBetsType {
    return {
        homeTeamScore: home,
	    awayTeamScore: away, 
	    amountBet: amountBet,
	    gameId: gameId,
	    participantId: participantId,
    }
}