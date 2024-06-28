import { Router } from "express";
import passport from "passport";
import {
  githubAuth,
  githubCallback,
  login,
  register,
  failLogin,
  failRegister,
  logout,
} from "../../controllers/authControllers.js";

const router = Router();
router.get(
  "/github",
  passport.authenticate("github", { scope: "user.email" }),
  githubAuth
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  githubCallback
);

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "failregister" }),
  register
);

router.get("/failregister", failRegister);

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "faillogin" }),
  login
);

router.get("/faillogin", failLogin);

router.post("/logout", logout);

export default router;
