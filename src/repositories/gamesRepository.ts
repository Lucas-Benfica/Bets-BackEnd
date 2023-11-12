import prisma from "database/database";
import { Game } from "@prisma/client";
import { createGamesType } from "schemas/gamesSchema";

async function createGame(gameInfo: createGamesType): Promise<Game> {
    const result = await prisma.game.create({
        data: gameInfo
    });
    return result;
}

async function getGames(): Promise<Game[]> {
    const result = await prisma.game.findMany();
    return result;
}

async function getGamesById(gameId: number): Promise<Game> {
    const result = await prisma.game.findUnique({
        where: { id: gameId }
    });
    return result;
}

async function finishGame(gameId: number, homeTeamScore: number, awayTeamScore: number) {
    await prisma.game.update({
        where: { id: gameId },
        data: {
            isFinished: true,
            homeTeamScore,
            awayTeamScore,
        },
    });
    const result = prisma.game.findUnique({
        where: { id: gameId },
        include: { Bet: true }
    });
    return result;
}

const gamesRepository = {
    createGame, getGames, getGamesById, finishGame
};

export default gamesRepository;