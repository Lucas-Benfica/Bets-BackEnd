import betsController from "../controllers/betsController";
import  Router  from "express";
import { validateSchema } from "../middlewares/schema-handler";
import { betsSchema } from "../schemas/betsSchema";

const betsRouter = Router();

betsRouter.post("/bets", validateSchema(betsSchema), betsController.createBet);

export default betsRouter;