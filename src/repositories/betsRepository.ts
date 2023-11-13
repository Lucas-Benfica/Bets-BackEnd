import prisma from "database/database";
import { Bet } from "@prisma/client";
import { createBetsType } from "schemas/betsSchema";

async function createBet(betInfo: createBetsType) {
    console.log("INFORMAÇÃO AQUI", betInfo.gameId);
    const result = await prisma.bet.create({
        data: {
            homeTeamScore: betInfo.homeTeamScore,
            awayTeamScore: betInfo.awayTeamScore,
            amountBet: betInfo.amountBet,
            gameId: betInfo.gameId,
            participantId: betInfo.participantId,
        }
    });
    return result;
}

async function finishBets(gameBets: Bet[]) {
    for (const bet of gameBets) {
        await updateBet(bet.id, bet.status, bet.amountWon);
    }
}

async function updateBet(betId: number, status: string, amountWon: number) {
    await prisma.bet.update({
        where: { id: betId },
        data: {
            updatedAt: new Date(),
            status: status,
            amountWon: amountWon,
        },
    });
}



const betsRepository = {
    createBet, finishBets
}

export default betsRepository;
 