import prisma from "../../src/database/database";
import { faker } from '@faker-js/faker';
import { createParticipantType } from "../../src/schemas/participantsSchema";
import { Participant } from "@prisma/client";

export function createParticipantInfo(): createParticipantType {
    return {
        name: faker.internet.userName(),
        balance: faker.number.int({ min: 1000, max: 500000 })
    }
}

export async function createParticipant(): Promise<Participant> {
    return await prisma.participant.create({
        data:{
            name: faker.internet.userName(),
            balance: faker.number.int({ min: 1000, max: 500000 })
        }
    })
}