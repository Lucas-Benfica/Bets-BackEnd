import supertest from "supertest";
import app from "../src/app";
import { cleanDb } from "./services/helpers";
import httpStatus from "http-status";
import { createGameInfo, createGameWithBets, createManyGames } from "./factories/games-factory";

const api = supertest(app);

beforeEach(async () => {
    await cleanDb();
})

describe("POST /games", () => {
    it("Should respond with status 400 when body is not given", async () => {
        const response = await api.post('/games');
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
    it("Should respond with status 422 when body is incomplete", async () => {
        const response = await api.post('/games').send({ homeTeamName: "Vasco" });
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
        const response2 = await api.post('/games').send({ awayTeamName: "Flamengo" });
        expect(response2.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
    describe('When body is valid', () => {
        it("Should respond with status 201 and the new game info", async () => {
            const game = createGameInfo()
            const response = await api.post('/games').send(game);
            expect(response.status).toBe(httpStatus.CREATED);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    homeTeamName: game.homeTeamName,
                    awayTeamName: game.awayTeamName,
                    homeTeamScore: 0,
                    awayTeamScore: 0,
                    isFinished: false
                })
            )
        })
    })
})

describe("GET /games", () => {
    it("should return an empty array if there are no registered games.", async () => {
        const response = await api.get('/games');
        console.log(response.body);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toStrictEqual([]);
    });

    it("Should return all games and status 200.", async () => {
        const numberOfGames = 3;
        createManyGames(numberOfGames);
        const response = await api.get('/games');
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toHaveLength(numberOfGames);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    homeTeamName: expect.any(String),
                    awayTeamName: expect.any(String),
                    homeTeamScore: 0,
                    awayTeamScore: 0,
                    isFinished: false
                })
            ])
        )
    })
})

describe("/GET/:id", () => {
    
    it("Should return the game with the id sent and empty bets array.", async () => {
        const info = createGameInfo()
        const game = await api.post('/games').send(info);

        const response = await api.get(`/games/${game.body.id}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toMatchObject({
            ...game.body,
            bets: []
        });
    });
    it("Should return the game with the id sent and bets array.", async () => {
        const game = await createGameWithBets();

        const response = await api.get(`/games/${game.id}`);

        console.log("Aqui estou eu", response.body);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                homeTeamName: expect.any(String),
                awayTeamName: expect.any(String),
                homeTeamScore: 0,
                awayTeamScore: 0,
                isFinished: false,
                bets: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                        homeTeamScore: expect.any(Number),
                        awayTeamScore: expect.any(Number),
                        amountBet: expect.any(Number),
                        gameId: expect.any(Number),
                        participantId: expect.any(Number),
                        status: expect.any(String),
                        amountWon: null,
                    }),
                ]),
            }),
        );

    })
})