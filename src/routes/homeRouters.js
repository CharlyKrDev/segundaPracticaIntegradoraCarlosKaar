import express from "express";
import productsModel from "../dao/models/products.model.js";
import cartsModel from "../dao/models/carts.models.js";
import userModel from "../dao/models/user.model.js";

export const homeRouter = express.Router();

homeRouter.get("/", async (req, res) => {
  let userId = null;
  let cartId = null;

  if (req.user) {
    userId = req.user._id;
  }

  try {
    // Si el usuario está autenticado, buscar el carrito
    if (userId) {
      const user = await userModel.findOne({ _id: userId });
      if (!user) {
        return res
          .status(404)
          .redirect("/register", { status: "error", message: "Usuario inexistente" });
      }
      cartId = user.cart ? user.cart.toString() : null;
    }

    let { limit = 10, page = 1, sort, debug } = req.query;
    const totalProduct = await productsModel.countDocuments();

    // Convertir limit a número si no es "all"
    limit = limit === "all" ? totalProduct : parseInt(limit);
    page = parseInt(page);

    // Validar los parámetros limit y page
    if (
      isNaN(page) ||
      page < 1 ||
      (limit !== undefined && (isNaN(limit) || limit < 1))
    ) {
      return res.status(400).json({ error: "Valor de limit o page inválido" });
    }

    const options = {
      limit,
      page,
      sort: sort ? { price: sort } : {},
      lean: true,
    };

    const products = await productsModel.paginate({}, options);

    if (debug) {
      return res.json({
        status: "success",
        payload: products.docs,
        totalPages: products.totalPages,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
      });
    }

    const prevLink = products.hasPrevPage
      ? `http://localhost:8080/products/?page=${products.prevPage}&limit=${limit}`
      : "";
    const nextLink = products.hasNextPage
      ? `http://localhost:8080/products/?page=${products.nextPage}&limit=${limit}`
      : "";
    const isValid = !(page <= 0 || page > products.totalPages);

    res.render("home", {
      style: "style.css",
      productos: products.docs,
      totalPages: products.totalPages,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      prevLink,
      nextLink,
      isValid,
      cart: cartId,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});
