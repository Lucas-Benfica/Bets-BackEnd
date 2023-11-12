import prisma from "database/database";
import { Participant } from "@prisma/client";
import { createParticipantType, updateParticipantType } from "schemas/participantsSchema";

async function createParticipant (participantInfo: createParticipantType): Promise<Participant>{
    const result = await prisma.participant.create({
        data: participantInfo
    })
    return result;
}
async function getParticipants(): Promise<Participant[]> {
    const result = await prisma.participant.findMany();
    return result;
}
async function updateParticipant(participantId: number, newBalance: number ) {
    await prisma.participant.update({
        where: { id: participantId },
        data: {
            balance: newBalance,
            updatedAt: new Date()
        }
    })
}
async function resultOfParticipantsBets(participantAfterBet: updateParticipantType[]) {
    const updateManyData = participantAfterBet.map((participant) => ({
        where: { id: participant.id },
        data: {
            updatedAt: new Date(),
            balance: {
                increment: participant.amountWon,
            },
        },
    }));


    await prisma.participant.updateMany({
        data: updateManyData,
    });
}

const participantsRepository = {
    createParticipant, getParticipants, updateParticipant, resultOfParticipantsBets
}

export default participantsRepository;