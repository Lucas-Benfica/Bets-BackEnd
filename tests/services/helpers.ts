import prisma from "../../src/database/database";

export async function cleanDb() {
    await deleteBets();
    await prisma.game.deleteMany();
    await prisma.participant.deleteMany();
}

async function deleteBets() {
    await prisma.bet.deleteMany();
    return;
}

