import express from "express";
import {
  getProductsApi,
  getProductByIdApi,
  deleteProductByIdApi,
  addProductApi,
  updateProductApi,
} from "../../controllers/productsControllers.js";
export const productsRouterApi = express.Router();

productsRouterApi.get("/", getProductsApi);
productsRouterApi.get("/:pid", getProductByIdApi);
productsRouterApi.delete("/:pid", deleteProductByIdApi);
productsRouterApi.put("/:pid", addProductApi);
productsRouterApi.post("/", updateProductApi);
