import prisma from "database/database";
import { Participant } from "@prisma/client";
import { createParticipantType } from "schemas/participantsSchema";

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

const participantsRepository = {
    createParticipant, getParticipants
}

export default participantsRepository;