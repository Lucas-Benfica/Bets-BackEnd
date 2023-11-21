import prisma from "../database/database";
import { Participant } from "@prisma/client";
import { createParticipantType, updateParticipantType } from "../schemas/participantsSchema";

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
async function getParticipantsById(participantId: number): Promise<Participant> {
    const result = await prisma.participant.findUnique({
        where:{
            id: participantId
        }
    });
    return result;
}
async function updateParticipant(participantId: number, amountBet: number ) {
    await prisma.participant.update({
        where: { id: participantId },
        data: {
            balance: {
                decrement: amountBet
            },
            updatedAt: new Date()
        }
    })
}
async function resultOfParticipantsBets(participantAfterBet: updateParticipantType[]) {
    for (const participant of participantAfterBet) {
        await updateWithBet(participant.id, participant.amountWon);
    }
}

async function updateWithBet(participantId: number, amountWon: number) {
    await prisma.participant.update({
        where: { id: participantId },
        data: {
            updatedAt: new Date(),
            balance: {
                increment: amountWon,
            },
        },
    });
}


const participantsRepository = {
    createParticipant, getParticipants, getParticipantsById, updateParticipant, resultOfParticipantsBets
}

export default participantsRepository;