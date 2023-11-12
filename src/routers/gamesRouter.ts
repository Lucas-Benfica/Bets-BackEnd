import  Router  from "express";
import { validateSchema } from "middlewares/schema-handler";

const gamesRouter = Router();

gamesRouter.post("/games");
gamesRouter.get("/games");

export default gamesRouter;