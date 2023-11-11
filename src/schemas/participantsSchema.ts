import Joi from "joi";

export type createParticipantType = {
    name: string,
    balance: number
}

export const partivipantsSchema = Joi.object<createParticipantType>({
    name: Joi.string().required(),
    balance: Joi.number().required()
})