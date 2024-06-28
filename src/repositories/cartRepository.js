import cartsModel from "../models/carts.models.js";

export const createCart = async () => {
  const newCart = new cartsModel({ products: [] });
  await newCart.save();
  return newCart._id;
};
