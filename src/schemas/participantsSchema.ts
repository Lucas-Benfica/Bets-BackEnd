import Joi from "joi";

export type createParticipantType = {
    name: string,
    balance: number
}

export const participantsSchema = Joi.object<createParticipantType>({
    name: Joi.string().required(),
    balance: Joi.number().required()
})

export type updateParticipantType = {
    id: number,
    amountWon: number
}