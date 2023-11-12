import { Router } from "express";
import participantsRouter from "./participantsRouter";
import gamesRouter from "./gamesRouter";

const router = Router();

router.use(participantsRouter);
router.use(gamesRouter);

export default router;