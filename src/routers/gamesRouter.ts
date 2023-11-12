import gamesController from "controllers/gamesController";
import  Router  from "express";
import { validateSchema } from "middlewares/schema-handler";
import { gamesSchema, gamesUpdateSchema } from "schemas/gamesSchema";

const gamesRouter = Router();

gamesRouter.post("/games", validateSchema(gamesSchema), gamesController.createGame);
gamesRouter.get("/games", gamesController.getGames);
gamesRouter.get("/games/:id", gamesController.getGamesById);
gamesRouter.post("/games/:id/finish", validateSchema(gamesUpdateSchema), gamesController.finishGame);

export default gamesRouter;