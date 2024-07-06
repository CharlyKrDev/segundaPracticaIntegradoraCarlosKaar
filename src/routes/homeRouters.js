import express from "express";
import { getHomePage } from "../controllers/homeControllers.js";
import { getHomePage404 } from "../controllers/homeControllers.js";

export const homeRouter = express.Router();

homeRouter.get("/products", getHomePage);
homeRouter.get("/404", getHomePage404);