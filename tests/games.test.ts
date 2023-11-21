import supertest from "supertest";
import app from "../src/app";
import { cleanDb } from "./services/helpers";
import httpStatus from "http-status";
import { createGameInfo, createGameWithBets, createGame } from "./factories/games-factory";
import { createParticipant } from "./factories/participants-factory";
import { createBetInfo2 } from "./factories/bets-factory";
import prisma from "database/database";

const api = supertest(app);

beforeEach(async () => {
    await cleanDb();
})
afterEach(async () => {
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
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toStrictEqual([]);
    });

    it("Should return all games and status 200.", async () => {
        await createGame();
        await createGame();
        await createGame();
        const response = await api.get('/games');
        expect(response.status).toBe(httpStatus.OK);
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
    it("Should return 404 when game id don't exist.", async () => {
        const response = await api.get('/games/1');
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    })
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

describe("POST /games/:id/finish", () => {
    it("Should return 404 when game id don't exist.", async () => {
        const response = await api.post('/games/1/finish').send({
            homeTeamScore: 1,
            awayTeamScore: 1,
        });
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    describe("When id is valid:", () => {
        it("Should return a game with a empty bets array", async () => {
            const game = await createGame();
            
            const response = await api.post(`/games/${game.id}/finish`).send({
                homeTeamScore: 1,
                awayTeamScore: 1,
            });
            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toMatchObject({
                ...game,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                homeTeamScore: 1,
                awayTeamScore: 1,
                isFinished: true,
                bets: []
            });
        });
        it("Should return status 200, update the bets and participants & return the game finished.", async () => {
            const participant1 = await createParticipant();
            const participant2 = await createParticipant();
            const participant3 = await createParticipant();

            const game = await createGame();

            const bet1 = await api.post("/bets").send(createBetInfo2(game.id, participant1.id, 1000, 2,2));
            const bet2 = await api.post("/bets").send(createBetInfo2(game.id, participant2.id, 2000, 2,2));
            const bet3 = await api.post("/bets").send(createBetInfo2(game.id, participant3.id, 3000, 3,1));

            const response = await api.post(`/games/${game.id}/finish`).send({
                homeTeamScore: 2,
                awayTeamScore: 2,
            });

            const participant2After = await prisma.participant.findUnique({where: { id: participant2.id }});
            const bet2After = await prisma.bet.findUnique({where: { id: bet2.body.id }});

            console.log(participant2, participant2After);
            console.log(bet2.body, bet2After);


            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toMatchObject({
                ...game,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                homeTeamScore: 2,
                awayTeamScore: 2,
                isFinished: true,
                bets: expect.arrayContaining([
                  expect.objectContaining({
                    amountBet: expect.any(Number),
                    amountWon: expect.any(Number),
                    awayTeamScore: expect.any(Number),
                    createdAt: expect.any(String),
                    gameId: expect.any(Number),
                    homeTeamScore: expect.any(Number),
                    id: expect.any(Number),
                    participantId: expect.any(Number),
                    status: expect.any(String),
                    updatedAt: expect.any(String),
                  }),
                ]),
            });
            expect(participant2After.balance).toBe(participant2.balance - bet2.body.amountBet + bet2After.amountWon);
            expect(bet2After.amountWon).toBe(2800);
        });            
    })
})