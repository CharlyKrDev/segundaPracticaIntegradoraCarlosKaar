import express from "express";
import { renderMessages } from "../controllers/messagesController.js";

export const messagesRouter = express.Router();

messagesRouter.get("/", renderMessages);