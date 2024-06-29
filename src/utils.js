import { fileURLToPath } from "url";
import { dirname, join } from "path";
import handlebars from "express-handlebars";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

// Implementación de JWT

export const SECRET_KEY = process.env.JWT_SECRET;

export const generateToken = (user) => {
  const payload = {
    sub: user._id,
    email: user.email,
    role: user.role,
    cart: user.cart,
  };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '12h' });
}

// Funciones para hashear password
const  createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

// Variables de ruteo

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const viewsPath = join(__dirname + "/views");
const publicPath = join(__dirname + "/public");

// Función(engine) que me permite multiplicar cantidad y precio dentro de handlebars

const hbs = handlebars.create({
    defaultLayout: 'main',
    helpers: {
      multiply: (a, b) => a * b
    }
  });

export { __dirname, viewsPath, publicPath, __filename, hbs, createHash, isValidPassword };
