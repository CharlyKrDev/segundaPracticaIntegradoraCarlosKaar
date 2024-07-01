import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/user.model.js";
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

  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, loginPassportController)
  );

  // Estrategia con GitHub
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
    try {
      console.log('Serializing user:', user);
      
      // Verificar que user tiene la estructura correcta para serializar
      const userId = user._id || user.user._id; // Adaptar según la estructura real
      
      done(null, userId);
    } catch (error) {
      done(error);
    }
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findById(id);
      if (!user) {
        return done(new Error('Usuario no encontrado'), null);
      }
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default initializePassport;
