import userModel from "../../data/models/user.model.js";

export const findUserByEmail = async (email) => {
  return await userModel.findOne({ email });
};

export const createUser = async (userData) => {
  return await userModel.create(userData);
};

export const updateUserCart = async (userId, cartId) => {
  return await userModel.updateOne({ _id: userId }, { cart: cartId });
};

export const findUserById = async (userId) => {
  return await userModel.findById(userId);
};
