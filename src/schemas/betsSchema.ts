import Joi from "joi";

export type createBetsType = { 
	homeTeamScore: number;
	awayTeamScore: number; 
	amountBet: number;
	gameId: number; 
	participantId: number;
}

export const betsSchema = Joi.object<createBetsType>({ 
	homeTeamScore: Joi.number().min(0).required(),
	awayTeamScore: Joi.number().min(0).required(), 
	amountBet: Joi.number().required(),
	gameId: Joi.number().min(0).required(), 
	participantId: Joi.number().min(0).required()
})