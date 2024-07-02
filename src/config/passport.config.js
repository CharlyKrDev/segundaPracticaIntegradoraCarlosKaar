import passport from "passport";
import local from "passport-local";
import userModel from "../data/models/user.model.js";
import GithubStrategy from "passport-github2";
import dotenv from "dotenv";
import {
  registerPassportController,
  passportGithubController,
  loginPassportController,
} from "../controllers/passportControllers.js";

dotenv.config();

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  // Estrategia Local
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      registerPassportController
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });

  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, loginPassportController)
  );

  //estrategia con tercero
  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      passportGithubController
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;