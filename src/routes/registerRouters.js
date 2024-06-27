import { Router } from "express";
import { isAuthenticated, isNotAuthenticated } from "../middleware/auth.js";
import { renderLogin, renderRegister, renderCurrent } from "../controllers/registerControllers.js";

const registerRouter = Router();

registerRouter.get("/login", isNotAuthenticated, renderLogin);

registerRouter.get("/register", isNotAuthenticated, renderRegister);

registerRouter.get("/current", isAuthenticated, renderCurrent);

export default registerRouter;