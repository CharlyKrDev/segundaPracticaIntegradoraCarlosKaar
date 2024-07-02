import { Router } from "express";
import productsModel from "../../data/models/products.model.js";
import productsDAO from "../../dao/class/products.dao.js";


const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit);
  try {
    let products;
    if (!isNaN(limit)) {
      products = await productsDAO.getProductsLimit(limit);
    } else {
      products = await productsDAO.getProducts();
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

productsRouter.get("/products/:pid", async (req, res) => {
  const productId = req.params.pid;
  try {
    let product;

    product = await productsDAO.getProductById({ _id: productId });
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});
productsRouter.post("/products", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail,
  } = req.body;
  try {
    let checkCode = await productsDAO.getProductByCode({ code: code });

    if (checkCode.length > 0) {
      return res.status(400).json({ error: "Code existente" });
    }

    const newProduct = await productsModel.create(req.body);

    res.status(200).json({
      Producto: newProduct,
      message: `Producto cargado correctamente`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}),
  productsRouter.put("/products/:pid", async (req, res) => {
    const productId = req.params.pid;
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = req.body;
    try {
      let checkId = await productsDAO.getProductById({ _id: productId });
      if (!checkId) {
        return res
          .status(404)
          .send(`No se encontró ningún producto con el ID ${productId}`);
      }
      let checkCode = await productsDAO.getProductByCode({ code: code });

      if (checkCode.length > 0) {
        return res.status(400).json({ error: "Code existente" });
      }
      await productsModel.updateOne({ _id: productId }, req.body);

      res.status(200).json({ message: `Producto actualizado correctamente` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

productsRouter.delete("/products/:pid", async (req, res) => {
  const productId = req.params.pid;

  try {
    let checkId = await productsDAO.getProductById({ _id: productId });
    if (!checkId) {
      return res
        .status(404)
        .send(`No se encontró ningún producto con el ID ${productId}`);
    }
    await productsDAO.deleteProductById(productId);
    res
      .status(200)
      .json({message:`El producto id: ${productId} ha sido eliminado correctamente`});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default productsRouter;
