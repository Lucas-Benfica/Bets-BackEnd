import prisma from "../database/database";
import { Bet } from "@prisma/client";
import { createBetsType } from "../schemas/betsSchema";

async function createBet(betInfo: createBetsType) {
    const result = await prisma.bet.create({
        data: betInfo
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
 