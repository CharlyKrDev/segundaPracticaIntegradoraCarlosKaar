import { Router } from "express";
import { isAdminOrAdminMaster, isAuthenticated } from "../middleware/auth.js";
import { getCartsController, getCartsByIdController, createCartController, addProdCartController, deleteProdCartController, deleteCartUserController } from "../controllers/cartsControllers.js";
import { authenticateJWT } from "../middleware/authJwt.js";

const cartsRouterM = Router();

//Todos los carritos

cartsRouterM.get("/",isAuthenticated,authenticateJWT, isAdminOrAdminMaster, getCartsController);

// Obtener un carrito por ID
cartsRouterM.get("/:cid", isAuthenticated, authenticateJWT, getCartsByIdController);

// Crear un nuevo carrito
cartsRouterM.post("",isAuthenticated, authenticateJWT, createCartController);

// Agregar producto al carrito
cartsRouterM.put("/:cid/products/:pid",isAuthenticated, authenticateJWT, addProdCartController);
//Borrar producto del carrito
cartsRouterM.delete("/:cid/products/:pid",isAuthenticated, authenticateJWT, deleteProdCartController);

//Borrar carrito del usuario
cartsRouterM.delete("/:cid",isAuthenticated, authenticateJWT, deleteCartUserController);
export default cartsRouterM;
