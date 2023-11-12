import { Bet } from "@prisma/client";
import prisma from "../../src/database/database";
import { faker } from '@faker-js/faker';
import { createBetsType } from "schemas/betsSchema";

export function createBetInfo(gameId: number, participantId: number): createBetsType {
    return {
        homeTeamScore: faker.number.int({ min: 0, max: 2 }),
	    awayTeamScore: faker.number.int({ min: 0, max: 2 }), 
	    amountBet: 1000,
	    gameId: gameId,
	    participantId: participantId,
    }
}
export async function createBet(gameId: number, participantId: number): Promise<Bet> {
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