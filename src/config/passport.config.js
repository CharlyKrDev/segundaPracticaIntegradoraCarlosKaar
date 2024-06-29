import passport from "passport";
import local from 'passport-local'
import userModel from '../dao/models/user.model.js'
import { createHash, isValidPassword } from "../utils.js";
import GithubStrategy from "passport-github2"
import dotenv from "dotenv";
import cartsModel from "../dao/models/carts.models.js";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

dotenv.config(); 

const LocalStrategy = local.Strategy


const initializePassport = () => {

// Estrategia Local
passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            let user = await userModel.findOne({ email: username });
            if (user) {
                console.log("El usuario ya existe");
                return done(null, false);
            }

            let newCart = null;
            if (!user || !user.cart) {
                newCart = new cartsModel({ products: [] });
                await newCart.save();
            }

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: newCart ? newCart._id : null,  
            };

            let result = await userModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done("Error al obtener el usuario: " + error);
        }
    }
));


    passport.serializeUser((user, done) => {
      console.log(user)
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id)
        done(null, user)
    })


    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })

            if (!user) {
                console.log("El usuario no existe")
                return done(null, user)
            }

            let newCart = null;
            if (!user.cart || user.cart === null || user.cart === "" || user.cart === undefined) {
                newCart = new cartsModel({ products: [] });
                await newCart.save();
                user.cart = newCart._id;
                await userModel.updateOne({ _id: user._id }, { cart: newCart._id });
            }

            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))



    //estrategia con tercero
    passport.use('github', new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret:process.env.GITHUB_CLIENT_SECRET,
        callbackURL:"http://localhost:8080/api/sessions/githubcallback"
    }, async(accessToken, refreshToken, profile, done) =>{
        try {
            let user = await userModel.findOne({email: profile._json.email})
            if(!user){
                let newCart = null;
        
                let newUser={
                    first_name:profile._json.name,
                    last_name:"",
                    age:28,
                    email: profile._json.email,
                    password:"",
                    role: "user",
                    cart: newCart,  
                }

                let result = await userModel.create(newUser)
                if (!result.cart || result.cart === null || result.cart === "" || result.cart === undefined) {
                    newCart = new cartsModel({ products: [] });
                    await newCart.save();
                    result.cart = newCart._id;
                    await userModel.updateOne({ _id: result._id }, { cart: newCart._id });
                }
                done(null, result)
            }
            else{
                let newCart = null;
                if (!user.cart || user.cart === null || user.cart === "" || user.cart === undefined) {
                    newCart = new cartsModel({ products: [] });
                    await newCart.save();
                    user.cart = newCart._id;
                    await userModel.updateOne({ _id: user._id }, { cart: newCart._id });
                }
                done(null, user)
            }
        } catch (error) {

            done(error)
            
        }
    }
))


}


export default initializePassport

