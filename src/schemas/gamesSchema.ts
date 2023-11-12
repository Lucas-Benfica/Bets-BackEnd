import Joi from "joi";

export type createGamesType = {
	homeTeamName: string;
	awayTeamName: string;
}

export type updateGamesType = {
	homeTeamScore: number;
	awayTeamScore: number;
}

export const gamesSchema = Joi.object<createGamesType>({
    homeTeamName: Joi.string().required(),
    awayTeamName: Joi.string().required()
})

export const gamesUpdateSchema = Joi.object<updateGamesType>({
    homeTeamScore: Joi.number().min(0).required(),
    awayTeamScore: Joi.number().min(0).required()
})