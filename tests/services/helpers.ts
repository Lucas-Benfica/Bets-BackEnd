import prisma from "../../src/database/database";

export async function cleanDb() {
    await prisma.bet.deleteMany({});
    await prisma.game.deleteMany({});
    await prisma.participant.deleteMany({});
}