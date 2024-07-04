import userModel from "../../data/models/user.model.js"

class UsersDAO {
  async getUserByEmail(email) {
    return await userModel.findOne({ email });
  }
  async findUserByOne(id) {
    return await userModel.findOne({ _id:id });
  }


  async createNewUser(newUser) {
    return await userModel.create(newUser);
  }

  async updateUserCart(userId, cartId) {
    return await userModel.updateOne({ _id: userId }, { cart: cartId });
  }

  async updateUser(userId, updateData) {
    return await userModel.updateOne({ _id: userId }, updateData);
  }
  
  async findUserById (userId) {
    return await userModel.findById(userId);
}
}

export default new UsersDAO();
