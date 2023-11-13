import { Game } from "@prisma/client";
import prisma from "../../src/database/database";
import { faker } from '@faker-js/faker';
import { createGamesType, updateGamesType } from "schemas/gamesSchema";
import { createParticipant } from "./participants-factory";
import { createBet } from "./bets-factory";

export function createGameInfo(): createGamesType {
    const info = {
        homeTeamName: faker.company.name(),
        awayTeamName: faker.company.name()
    }

    return info;
}
export async function createGame(): Promise<Game> {
    
    const game = await prisma.game.create({
        data: {
            homeTeamName: faker.company.name(),
            awayTeamName: faker.company.name()
        }
    })

    return game;
}
export async function createGameWithBets(): Promise<Game> {
    const participant1 = await createParticipant();
    const participant2 = await createParticipant();
    const game = await prisma.game.create({
        data: {
            homeTeamName: faker.company.name(),
            awayTeamName: faker.company.name()
        }
    })
    await createBet(game.id, participant1.id);
    await createBet(game.id, participant2.id);

    return game;
}
export function updateGameInfo(): updateGamesType {
    const info = {
        homeTeamScore: faker.number.int({ min: 0, max: 3 }),
        awayTeamScore: faker.number.int({ min: 0, max: 3 }),
    };
    return info;
}