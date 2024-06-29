import { Router } from "express";
import { isAdminOrAdminMaster } from "../middleware/auth.js";
import { getCartsController, getCartsByIdController, createCartController, addProdCartController, deleteProdCartController, deleteCartUserController } from "../controllers/cartsControllers.js";
import { authenticateJWT } from "../middleware/authJwt.js";

const cartsRouterM = Router();

//Todos los carritos

cartsRouterM.get("/",authenticateJWT, isAdminOrAdminMaster, getCartsController);

// Obtener un carrito por ID
cartsRouterM.get("/:cid", authenticateJWT, getCartsByIdController);

// Crear un nuevo carrito
cartsRouterM.post("",authenticateJWT, createCartController);

// Agregar producto al carrito
cartsRouterM.put("/:cid/products/:pid",authenticateJWT, addProdCartController);
//Borrar producto del carrito
cartsRouterM.delete("/:cid/products/:pid",authenticateJWT, deleteProdCartController);

//Borrar carrito del usuario
cartsRouterM.delete("/:cid",authenticateJWT, deleteCartUserController);
export default cartsRouterM;
