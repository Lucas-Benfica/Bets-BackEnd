import { Router } from "express";
import participantsRouter from "./participantsRouter";

const router = Router();

router.use(participantsRouter);

export default router;