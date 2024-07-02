import userModel from "../data/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import cartsModel from "../data/models/carts.models.js";
export const registerPassportController = async (
  req,
  username,
  password,
  done
) => {
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
};

export const passportGithubController = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    let user = await userModel.findOne({ email: profile._json.email });
    if (!user) {
      let newCart = null;

      let newUser = {
        first_name: profile._json.name,
        last_name: "",
        age: 28,
        email: profile._json.email,
        password: "",
        role: "user",
        cart: newCart,
      };

      let result = await userModel.create(newUser);
      if (
        !result.cart ||
        result.cart === null ||
        result.cart === "" ||
        result.cart === undefined
      ) {
        newCart = new cartsModel({ products: [] });
        await newCart.save();
        result.cart = newCart._id;
        await userModel.updateOne({ _id: result._id }, { cart: newCart._id });
      }
      done(null, result);
    } else {
      let newCart = null;
      if (
        !user.cart ||
        user.cart === null ||
        user.cart === "" ||
        user.cart === undefined
      ) {
        newCart = new cartsModel({ products: [] });
        await newCart.save();
        user.cart = newCart._id;
        await userModel.updateOne({ _id: user._id }, { cart: newCart._id });
      }
      done(null, user);
    }
  } catch (error) {
    done(error);
  }
};

export const loginPassportController = async (username, password, done) => {
  try {
    const user = await userModel.findOne({ email: username });

    if (!user) {
      console.log("El usuario no existe");
      return done(null, user);
    }

    let newCart = null;
    if (
      !user.cart ||
      user.cart === null ||
      user.cart === "" ||
      user.cart === undefined
    ) {
      newCart = new cartsModel({ products: [] });
      await newCart.save();
      user.cart = newCart._id;
      await userModel.updateOne({ _id: user._id }, { cart: newCart._id });
    }

    if (!isValidPassword(user, password)) return done(null, false);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
};
