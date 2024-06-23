import { fileURLToPath } from "url";
import { dirname, join } from "path";
import handlebars from "express-handlebars";
import bcrypt from 'bcryptjs'

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
