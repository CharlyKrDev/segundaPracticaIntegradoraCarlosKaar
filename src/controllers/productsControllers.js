import ProductsDAO from '../dao/class/products.dao.js';
import CartsDAO from '../dao/class/carts.dao.js';

export const getProductsApi = async (req, res) => {
    try {
      let { limit = 10, page = 1, sort, debug } = req.query;
      const totalProduct = await ProductsDAO.getTotalProductsCount();
      const carts = await CartsDAO.getAllCarts();
      // Convert limit to a number if it's not "all"
      limit = limit === "all" ? totalProduct : parseInt(limit);
      page = parseInt(page);
  
      // Validate limit and page parameters
      if (
        isNaN(page) ||
        page < 1 ||
        (limit !== undefined && (isNaN(limit) || limit < 1))
      ) {
        return res.status(400).json({ error: "Invalid limit or page value" });
      }
  
      const options = {
        limit,
        page,
        sort: sort ? { price: sort } : {},
        lean: true,
      };
  
      const products = await ProductsDAO.getProductsPaginated({}, options);
  
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
        ? `http://localhost:8080/api/products/?page=${products.prevPage}&limit=${limit}`
        : "";
      const nextLink = products.hasNextPage
        ? `http://localhost:8080/api/products/?page=${products.nextPage}&limit=${limit}`
        : "";
      const isValid = !(page <= 0 || page > products.totalPages);
  
      res.status(200).json({
        productos: products.docs,
        totalPages: products.totalPages,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        prevLink: prevLink,
        nextLink: nextLink,
        isValid: isValid,
        carts: carts,
      });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  export const getProductByIdApi = async (req, res) => {
    const productId = req.params.pid;
    try {
      let product;
  
      product = await ProductsDAO.findOne(productId);
      res.status(200).json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  export const deleteProductByIdApi = async (req, res) => {
    const productId = req.params.pid;
  
    try {
      let checkId = await ProductsDAO.findOne(productId);
      if (!checkId) {
        return res
          .status(404)
          .send(`No se encontró ningún producto con el ID ${productId}`);
      }
      await ProductsDAO.deleteProductById (productId);
      res
        .status(200)
        .json({
          message: `El producto id: ${productId} ha sido eliminado correctamente`,
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  export const addProductApi = async (req, res) => {
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
        let checkId = await ProductsDAO.findOne(productId);
        if (!checkId) {
        return res
          .status(404)
          .send(`No se encontró ningún producto con el ID ${productId}`);
      }
  
      let checkCode = await ProductsDAO.getProductByCode({ code: code });
  
      if (checkCode.length > 0) {
        return res.status(400).json({ error: "Code existente" });
      }
      await ProductsDAO.updateOneProduct(productId, req.body);
  
      res.status(200).json({ message: `Producto actualizado correctamente` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  export const updateProductApi = async (req, res) => {
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
        let checkCode = await ProductsDAO.getProductByCode({ code: code });
  
      if (checkCode.length > 0) {
        return res.status(400).json({ error: "Code existente" });
      }
  
      const newProduct = await ProductsDAO.createProduct(req.body);
  
      res.status(200).json({
        Producto: newProduct,
        message: `Producto cargado correctamente`,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }