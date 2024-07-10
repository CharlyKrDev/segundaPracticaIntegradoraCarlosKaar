import express from "express";
import { isAdminOrAdminMaster } from "../middleware/auth.js";
import { isAuthenticated } from "../middleware/auth.js";
import { renderMessages } from "../controllers/messagesController.js";

export const messagesRouter = express.Router();

messagesRouter.get("/",isAuthenticated, isAdminOrAdminMaster, renderMessages);