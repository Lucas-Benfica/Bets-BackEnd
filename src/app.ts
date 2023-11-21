import express, {json}  from "express";
import "express-async-errors";
import { handleApplicationErrors } from "./middlewares/error-handler";
import router from "./routers";

const app = express();
app.use(json());
app.use(router);
app.use(handleApplicationErrors);

export default app;