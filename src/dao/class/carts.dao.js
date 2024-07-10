import cartsModel from "../../data/models/carts.models.js";

class CartsDAO {
  async getAllCarts() {
    return await cartsModel.find().lean();
  }

  async getCartById(id) {
    return await cartsModel.findById(id).populate('products.productId').lean();
  }

  async createCart() {
    const newCart = new cartsModel({ products: [] });
    return await newCart.save();
  }

  async addProductToCartApi(cartId, productId) {
    const cart = await cartsModel.findById(cartId);
    if (!cart) throw new Error('Cart not found');

    const productInCart = cart.products.find(p => p.productId.equals(productId));
    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ productId, quantity: 1 });
    }

    return await cart.save();
  }
  async addProductToCart(cartId, productId) {
    const cart = await cartsModel.findById(cartId);
    if (!cart) throw new Error('Cart not found');

    const productInCart = cart.products.find(p => p.productId.equals(productId));
    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.products.push({ productId, quantity: 1 });
    }

    return await cart.save();
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await cartsModel.findById(cartId);
    if (!cart) throw new Error('Cart not found');

    const productIndex = cart.products.findIndex(p => p.productId.equals(productId));
    if (productIndex === -1) throw new Error('Product not found in cart');

    const productInCart = cart.products[productIndex];
    if (productInCart.quantity > 1) {
      productInCart.quantity -= 1;
    } else {
      cart.products.splice(productIndex, 1);
    }

    return await cart.save();
  }

  async deleteCart(cartId) {
    return await cartsModel.findByIdAndDelete(cartId);
  }
}

export default new CartsDAO();
