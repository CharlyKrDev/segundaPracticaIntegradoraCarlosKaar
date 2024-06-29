import express from "express";
import { dashboardRender } from "../controllers/dashboardControllers.js";
import { isAdminOrAdminMaster } from "../middleware/auth.js";
import { isAuthenticated } from "../middleware/auth.js";
import { authenticateJWT } from "../middleware/authJwt.js";

export const dashboardProductsRouter = express.Router();

dashboardProductsRouter.get("/",authenticateJWT, isAuthenticated, isAdminOrAdminMaster, dashboardRender);