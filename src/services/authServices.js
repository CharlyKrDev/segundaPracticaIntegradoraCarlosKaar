import { createHash, isValidPassword } from "../utils.js";
import CartsDAO from "../dao/class/carts.dao.js";
import usersDAO from "../dao/class/users.dao.js";

export const registerUser = async (userData) => {
  const { first_name, last_name, email, age, password } = userData;

  let user = await usersDAO.getUserByEmail(email);
  if (user) {
    throw new Error("El usuario ya existe");
  }
  const cart = await CartsDAO.createCart()
  const cartId = cart._id;
  const newUser = {
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
    cart: cartId,
  };

  return await usersDAO.createNewUser(newUser);
};

export const loginUser = async (email, password) => {
  const user = await usersDAO.getUserByEmail(email);

  if (!user || !isValidPassword(user, password)) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  if (!user.cart) {
    const cart = await CartsDAO.createCart()
    const cartId = cart._id;
    await usersDAO.updateUserCart(user._id, cartId);
    user.cart = cartId;
  }

  return user;
};

export const findOrCreateGithubUser = async (profile) => {
  let user = await usersDAO.getUserByEmail(profile._json.email);

  if (!user) {
    const cart = await CartsDAO.createCart()
    const cartId = cart._id;
    const newUser = {
      first_name: profile._json.name,
      last_name: "",
      age: 28,
      email: profile._json.email,
      password: "",
      role: "user",
      cart: cartId,
    };

    return await usersDAO.createNewUser(newUser);
  } else {
    if (!user.cart) {
      const cartId = await createCart();
      await updateUserCart(user._id, cartId);
      user.cart = cartId;
    }

    return user;
  }
};
