import supertest from "supertest";
import app from "../src/app";
import { cleanDb } from "./services/helpers";
import httpStatus from "http-status";
import { createGame, updateGameInfo } from "./factories/games-factory";
import { createBetInfo } from "./factories/bets-factory";
import { createParticipant } from "./factories/participants-factory";
import prisma from "database/database";

const api = supertest(app);

beforeEach(async () => {
    await cleanDb();
})
afterEach(async () => {
    await cleanDb();
})

describe("POST /bets", () => {
    it("Should respond with status 400 when body is not given", async () => {
        const response = await api.post('/bets');
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
    it("Should respond with status 422 when body is incomplete", async () => {
        const newBet = createBetInfo(1,1);
        delete newBet.homeTeamScore;

        const response = await api.post('/bets').send(newBet);
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
    describe("When body is valid:", () => {
        it("Should respond with status 404 when game don't exist", async () => {
            const participant = await createParticipant();
            const bet = createBetInfo(1,participant.id);

            const response = await api.post('/bets').send(bet);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });
        it("Should respond with status 400 when the game has already finished", async () => {
            const participant = await createParticipant();
            const game = await createGame();

            await api.post(`/games/${game.id}/finish`).send(updateGameInfo());

            const bet = createBetInfo(game.id, participant.id);

            const response = await api.post('/bets').send(bet);

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        })
        it("Should respond with status 404 when participant don't exist", async () => {
            const game = await createGame();
            const bet = createBetInfo(game.id, 1);

            const response = await api.post('/bets').send(bet);

            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });
        it("Should respond with status 400 when the bet is greater than the participant's balance", async () => {
            const participant = await createParticipant();
            const game = await createGame();

            const bet = createBetInfo(game.id, participant.id, participant.balance + 1000);

            const response = await api.post('/bets').send(bet);

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });
        it("Should subtract the bet amount from the participant's balance.", async () => {
            const participant = await createParticipant();
            const game = await createGame();

            const bet = createBetInfo(game.id, participant.id);
            const response = await api.post('/bets').send(bet);

            const participantAfterBet = await prisma.participant.findUnique({
                where:{id: participant.id}
            });

            expect(response.status).toBe(httpStatus.CREATED);
            expect(participantAfterBet.balance).toBe(participant.balance - bet.amountBet);
        });
        it("Should return the bet information.", async () => {
            const participant = await createParticipant();
            const game = await createGame();

            const bet = createBetInfo(game.id, participant.id);
            const response = await api.post('/bets').send(bet);
            expect(response.status).toBe(httpStatus.CREATED);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    homeTeamScore: bet.homeTeamScore,
                    awayTeamScore: bet.awayTeamScore,
                    amountBet: bet.amountBet,
                    gameId: game.id, 
                    participantId: participant.id,
                    status: "PENDING",
                    amountWon: null,
                }))
        });
    })
})