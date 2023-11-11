import supertest from "supertest";
import app from "../src/app";
import prisma from "../src/database/database";
import { cleanDb } from "./services/helpers";
import httpStatus from "http-status";

const api = supertest(app);

beforeEach(async () => {
    await cleanDb();
})

describe("POST /participants", () => {
    it("Should respond with status 400 when body is not given", async () => {
        const response = await api.post('/participants');
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
    it("Should respond with status 422 when body is incomplete", async () => {
        const response = await api.post('/participants').send();
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });
    describe('When body is valid', () => {
        it("Should respond with status 400 when the balance is less than R$10,00", async () => {

        });
        it("Should respond with status 201 when the participant is created", async () => {

        });
    })
})