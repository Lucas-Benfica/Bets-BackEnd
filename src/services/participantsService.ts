import { InvalidDataError } from "../errors/InvalidDataError";
import participantsRepository from "../repositories/participantsRepository";
import { createParticipantType } from "../schemas/participantsSchema";

function createParticipant(participantInfo: createParticipantType){
    if(participantInfo.balance < 1000) throw InvalidDataError("The balance must be greater than R$10.00");

    return participantsRepository.createParticipant(participantInfo);
}
function getParticipants(){
    return participantsRepository.getParticipants();
}

const participantsService = {
    createParticipant, getParticipants
}

export default participantsService;