import supertest from "supertest";
import app from "../src/app";
import { cleanDb } from "./services/helpers";
import httpStatus from "http-status";
import { createParticipant, createParticipantInfo } from "./factories/participants-factory";

const api = supertest(app);

beforeAll(async () => {
    await cleanDb();
});
beforeEach(async () => {
    await cleanDb();
})
afterEach(async () => {
    await cleanDb();
})

describe("POST /participants", () => {
    it("Should respond with status 400 when body is not given", async () => {
        const response = await api.post('/participants');
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
    it("Should respond with status 422 when body is incomplete", async () => {
        const response = await api.post('/participants').send({name: "Lucas"});
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    });
    describe('When body is valid', () => {
        it("Should respond with status 400 when the balance is less than R$10,00 (1000)", async () => {
            const response = await api.post('/participants').send({name: "Lucas", balance: 10});
            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        });
        it("Should respond with status 201 when the participant is created", async () => {
            const newParticipant = createParticipantInfo();
            const response = await api.post('/participants').send({name: newParticipant.name, balance: newParticipant.balance});
            expect(response.status).toBe(httpStatus.CREATED);
            expect(response.body).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    name: newParticipant.name,
                    balance: newParticipant.balance
                })
            )
        });
    })
})

describe("GET /participants", () => {
    it("should return an empty array if there are no registered participants.", async () => {
        const response = await api.get('/participants');
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toStrictEqual([]);
    });
    it("Should return all participants and status 200.", async () => {
        await createParticipant();
        await createParticipant();
        await createParticipant();
        const response = await api.get('/participants');
        console.log(" all participants",response.body);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    name: expect.any(String),
                    balance: expect.any(Number)
                })
            ])
        )
    })
})