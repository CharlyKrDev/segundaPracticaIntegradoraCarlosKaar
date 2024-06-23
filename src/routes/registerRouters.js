import { Router } from "express";
import { isAuthenticated, isNotAuthenticated } from "../middleware/auth.js";

const registerRouter = Router();

registerRouter.get("/login", isNotAuthenticated, (req, res) => {
  res.render("login", { style: "style.css" });
});

registerRouter.get("/register", isNotAuthenticated, (req, res) => {
  res.render("register", { style: "style.css" });
});

registerRouter.get("/current", isAuthenticated, (req, res) => {
  res.render("current", { user: req.session.user, style: "style.css" });
});



export default registerRouter;
