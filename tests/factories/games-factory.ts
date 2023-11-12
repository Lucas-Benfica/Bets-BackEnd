import { Game } from "@prisma/client";
import prisma from "../../src/database/database";
import { faker } from '@faker-js/faker';
import { createGamesType } from "schemas/gamesSchema";
import { createParticipant } from "./participants-factory";
import { createBet } from "./bets-factory";

export function createGameInfo(): createGamesType {
    return {
        homeTeamName: faker.company.name(),
        awayTeamName: faker.company.name()
    }
}
export async function createManyGames(numberOfGames: number): Promise<void> {
    const gamesData = [];
    for (let i = 0; i < numberOfGames; i++) {
        gamesData.push({
            homeTeamName: faker.company.name(),
            awayTeamName: faker.company.name()
        });
    };
    await prisma.game.createMany({
        data: gamesData,
    });
    return;
}
export async function createGame(): Promise<Game> {
    return await prisma.game.create({
        data: {
            homeTeamName: faker.company.name(),
            awayTeamName: faker.company.name()
        }
    })
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
    const bet1 = await createBet(game.id, participant1.id);
    const bet2 = await createBet(game.id, participant2.id);

    return game;
}