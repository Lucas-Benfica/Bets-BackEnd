import participantsController from "controllers/participantsController";
import  Router  from "express";
import { validateSchema } from "middlewares/schema-handler";
import { participantsSchema } from "schemas/participantsSchema";

const participantsRouter = Router();

participantsRouter.post("/participants", validateSchema(participantsSchema), participantsController.createParticipant);
participantsRouter.get("/participants", participantsController.getParticipants);

export default participantsRouter;