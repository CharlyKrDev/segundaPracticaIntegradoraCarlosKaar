import { findUserByEmail, createUser, updateUserCart, findUserById } from "../dao/repositories/userRepository.js";
import { createCart } from "../dao/repositories/cartRepository.js";
import { createHash, isValidPassword } from "../utils.js";

export const registerUser = async (userData) => {
  const { first_name, last_name, email, age, password } = userData;

  let user = await findUserByEmail(email);
  if (user) {
    throw new Error("El usuario ya existe");
  }

  const cartId = await createCart();
  const newUser = {
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
    cart: cartId,
  };

  return await createUser(newUser);
};

export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user || !isValidPassword(user, password)) {
    throw new Error("Usuario o contraseña incorrectos");
  }

  if (!user.cart) {
    const cartId = await createCart();
    await updateUserCart(user._id, cartId);
    user.cart = cartId;
  }

  return user;
};

export const findOrCreateGithubUser = async (profile) => {
  let user = await findUserByEmail(profile._json.email);

  if (!user) {
    const cartId = await createCart();
    const newUser = {
      first_name: profile._json.name,
      last_name: "",
      age: 28,
      email: profile._json.email,
      password: "",
      role: "user",
      cart: cartId,
    };

    return await createUser(newUser);
  } else {
    if (!user.cart) {
      const cartId = await createCart();
      await updateUserCart(user._id, cartId);
      user.cart = cartId;
    }

    return user;
  }
};
