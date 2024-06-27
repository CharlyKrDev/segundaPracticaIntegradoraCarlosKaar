import express from "express";
import { getHomePage } from "../controllers/homeControllers.js";

export const homeRouter = express.Router();

homeRouter.get("/", getHomePage);