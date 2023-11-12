import prisma from "database/database";
import { Bet } from "@prisma/client";
import { createBetsType } from "schemas/betsSchema";

async function createBet(betInfo: createBetsType) {
    const result = await prisma.bet.create({
        data: betInfo
    });
    return result;
}

async function finishBets(gameBets: Bet[]) {
    const updateManyData = gameBets.map((bet) => ({
        where: { id: bet.id },
        data: {
            updatedAt: new Date(),
            status: bet.status,
            amountWon: bet.amountWon
        },
    }));


    await prisma.bet.updateMany({
        data: updateManyData,
    });
}

const betsRepository = {
    createBet, finishBets
}

export default betsRepository;
 