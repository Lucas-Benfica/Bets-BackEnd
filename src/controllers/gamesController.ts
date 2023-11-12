import { Request, Response } from "express";
import httpStatus from "http-status";
import gamesService from "services/gamesService";

async function createGame(req: Request, res: Response) {
    const newGame = await gamesService.createGame(req.body)
    res.status(httpStatus.CREATED).send(newGame);
}

async function getGames(req: Request, res: Response) {
    const games = await gamesService.getGames();
    res.status(httpStatus.OK).send(games);
}

async function getGamesById(req: Request, res: Response) {
    const { id } = req.params;

    const game = await gamesService.getGamesById(Number(id));

    res.status(httpStatus.OK).send(game);
}

async function finishGame(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamScore, awayTeamScore } = req.body;
    const gameFinished = await gamesService.finishGame(Number(id), Number(homeTeamScore), Number(awayTeamScore));
    res.status(httpStatus.CREATED).send(gameFinished);
}

const gamesController = {
    createGame, getGames, getGamesById, finishGame
}

export default gamesController;
