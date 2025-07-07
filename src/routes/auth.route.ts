import { getAuthUser, signin } from "@controllers/auth.controller";
import { Router } from "express";
import { authorizeUser } from "src/middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/signin", signin);
authRouter.get("/user", authorizeUser, getAuthUser);

export default authRouter;
