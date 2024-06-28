import cartsModel from "../dao/models/carts.models.js";
import productsModel from "../dao/models/products.model.js";
import userModel from "../dao/models/user.model.js";
import mongoose from "mongoose";


const ObjectId = mongoose.Types.ObjectId;


export const getCartsController = async (req, res) => {
    try {
      const imgCart = "/public/img/carrito.jpg";
      const carts = await cartsModel.find().lean();
  
      res.render("carts", {
        style: "style.css",
        carts: carts,
        img: imgCart,
      });
    } catch (error) {
      res.status(500).json({
        message: `Error al obtener el carrito por ID`,
        error: error.message,
      });
    }
  }


  export const getCartsByIdController = async (req, res) => {
    const { cid } = req.params;
    try {
      const cart = await cartsModel
        .findById(cid)
        .populate("products.productId")
        .lean();
  
      // Inicializa el total a 0
      let total = 0;
  
      // Itera sobre cada producto en el carrito
      cart.products.forEach((product) => {
        // Multiplica la cantidad por el precio y suma al total
        total += product.quantity * product.productId.price;
      });
  
      // Ahora puedes renderizar el carrito incluyendo el total
      res.render("cart", {
        style: "style.css",
        cart: cart,
        total: total,
      });
    } catch (error) {
      res.status(500).render("noCart", {
        style: "style.css",
        message: `Error al obtener el carrito por ID`,
        error: error.message,
      });
    }
  }

  export const createCartController = async (req, res) => {
    try {
      const newCart = new cartsModel({ products: [] });
      await newCart.save();
      res
        .status(201)
        .json({ cart: newCart, message: `Carrito creado correctamente` });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error al crear el carrito`, error: error.message });
    }
  }

  export const addProdCartController = async (req, res) => {
    const { cid, pid } = req.params;
  
    try {
      // Verificar si el producto existe
      const product = await productsModel.findById(pid);
      if (!product) {
        return res
          .status(400)
          .json({ message: "Debe seleccionar el id de producto existente" });
      }
  
      // Verificar si el carrito existe
      const cart = await cartsModel.findById(cid);
      if (!cart) {
        return res
          .status(400)
          .json({ message: "Debe seleccionar el id de un carrito existente" });
      }
  
      // Verificar si el producto ya está en el carrito
      const productInCart = cart.products.find((p) => p.productId.equals(pid));
  
      if (productInCart) {
        // Incrementar la cantidad si el producto ya está en el carrito
        productInCart.quantity += 1;
      } else {
        // Agregar el producto al carrito si no está
        cart.products.push({ productId: new ObjectId(pid), quantity: 1 });
      }
  
      // Guardar los cambios
      await cart.save();
  
      res.status(201).json({
        message: `Agregado producto id: ${pid} al carrito id: ${cid}`,
        cart,
      });
    } catch (error) {
      console.error(`Error al agregar el producto al carrito:`, error);
      res.status(500).json({
        message: "Error al agregar el producto al carrito",
        error: error.message,
      });
    }
  }

  export const deleteProdCartController =  async (req, res) => {
    const { cid, pid } = req.params;
  
    try {
      // Verificar si el producto existe
      const product = await productsModel.findById(pid);
      if (!product) {
        return res
          .status(400)
          .json({ message: "Debe seleccionar el id de producto existente" });
      }
  
      // Verificar si el carrito existe
      const cart = await cartsModel.findById(cid);
      if (!cart) {
        return res
          .status(400)
          .json({ message: "Debe seleccionar el id de un carrito existente" });
      }
  
      // Verificar si el producto ya está en el carrito
      const productIndex = cart.products.findIndex((p) =>
        p.productId.equals(pid)
      );
      if (productIndex !== -1) {
        const productInCart = cart.products[productIndex];
        if (productInCart.quantity > 1) {
          productInCart.quantity -= 1;
        } else {
          cart.products.splice(productIndex, 1);
        }
  
        await cart.save();
  
        res.status(200).json({
          message: `Actualizada la cantidad del producto id: ${pid} en el carrito id: ${cid}`,
          cart,
        });
      } else {
        res.status(400).json({
          message: `El producto id: ${pid} no se encuentra en el carrito id: ${cid}`,
        });
      }
    } catch (error) {
      console.error(
        `Error al actualizar la cantidad del producto en el carrito:`,
        error
      );
      res.status(500).json({
        message: "Error al actualizar la cantidad del producto en el carrito",
        error: error.message,
      });
    }
  }

  export const deleteCartUserController = async (req, res) => {
    const userId = req.user._id;
    let cid;
    try {
      // Verificar si el usuario y carrito existen
      const user = await userModel.findOne({ _id: userId });
      if (!user) {
        return res
          .status(404)
          .send({ status: "error", message: "Usuario inexistente" });
      }
      cid = user.cart;
  
      const cart = await cartsModel.findById(cid);
      if (!cart) {
        return res
          .status(400)
          .json({ message: "Debe seleccionar el id de un carrito existente" });
      } else {
        await cartsModel.deleteOne({ _id: cid });
        await userModel.updateOne({ _id: user._id }, { cart: null});
        res
          .status(200)
          .json({ message: `Carrito ID: ${cid} borrado correctamente!`});
      }
  
    } catch (error) {
      console.error(`Error al querer borrar carrito:`, error);
      res.status(500).json({
        message: `Al querer borrar el carrito${cid}`,
        error: error.message,
      });
    }
  }