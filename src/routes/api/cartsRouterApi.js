import { Router } from "express";
import {
  getCartsApiController,
  getCartsApiByIdController,
  createCartApiController,
  addProdCartApiController,
  deleteProdCartApiController,
  deleteCartUserApiController,
} from "../../controllers/cartsApiControllers.js";
import { isAdminOrAdminMaster } from "../../middleware/auth.js";
import { isAuthenticated } from "../../middleware/auth.js";

const cartsRouterApiM = Router();

//Todos los carritos

cartsRouterApiM.get(
  "/",
  isAuthenticated,
  isAdminOrAdminMaster,
  getCartsApiController
);

// Obtener un carrito por ID
cartsRouterApiM.get("/:cid", getCartsApiByIdController);

// Crear un nuevo carrito
cartsRouterApiM.post("/", createCartApiController);

// Agregar producto al carrito
cartsRouterApiM.put("/:cid/products/:pid", addProdCartApiController);

//Borrar producto del carrito
cartsRouterApiM.delete("/:cid/products/:pid", deleteProdCartApiController);

//Borrar carrito
cartsRouterApiM.delete("/:cid", deleteCartUserApiController);

export default cartsRouterApiM;
