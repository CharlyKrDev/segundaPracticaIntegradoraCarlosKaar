import { Router } from "express";
import { isAdminOrAdminMaster } from "../middleware/auth.js";
import { getCartsController, getCartsByIdController, createCartController, addProdCartController, deleteProdCartController, deleteCartUserController } from "../controllers/cartsControllers.js";

const cartsRouterM = Router();

//Todos los carritos

cartsRouterM.get("/", isAdminOrAdminMaster, getCartsController);

// Obtener un carrito por ID
cartsRouterM.get("/:cid", getCartsByIdController);

// Crear un nuevo carrito
cartsRouterM.post("", createCartController);

// Agregar producto al carrito
cartsRouterM.put("/:cid/products/:pid", addProdCartController);
//Borrar producto del carrito
cartsRouterM.delete("/:cid/products/:pid", deleteProdCartController);

//Borrar carrito del usuario
cartsRouterM.delete("/:cid", deleteCartUserController);
export default cartsRouterM;
