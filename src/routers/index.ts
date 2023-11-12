import { Router } from "express";
import participantsRouter from "./participantsRouter";
import gamesRouter from "./gamesRouter";
import betsRouter from "./betsRouter";

const router = Router();

router.use(participantsRouter);
router.use(gamesRouter);
router.use(betsRouter);

export default router;