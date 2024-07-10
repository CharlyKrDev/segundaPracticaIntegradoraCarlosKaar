import mongoose from "mongoose";
import cartsDAO from "../dao/class/carts.dao.js";
import usersDAO from "../dao/class/users.dao.js";

export const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
};

export const isNotAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    res.redirect("/current");
  }
};

// Carrito

export const isCartOwner = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const userCart = req.user.cart;
    const userRole = req.user.role;
    const UserCartObjectId = new mongoose.Types.ObjectId(userCart).toString();
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.redirect("/404");
    }

    if (
      userRole === "admin" ||
      userRole === "adminMaster" ||
      cid === UserCartObjectId
    ) {
      return next();
    }
    const cart = await cartsDAO.getCartById(cid);
    if (!cart || cid !== UserCartObjectId) {
      return res.redirect("/404");
    }
    next();
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al verificar la propiedad del carrito",
        error: error.message,
      });
  }
};

// Role
export const isAdminOrAdminMaster = (req, res, next) => {
  const userRole = req.user.role;

  if (userRole === "admin" || userRole === "adminMaster") {
    return next();
  } else {
    return res.status(403).json({ message: "Acceso denegado" });
  }
};

export const isAdminMaster = (req, res, next) => {
  const userRole = req.user.role;

  if (userRole === "adminMaster") {
    return next();
  } else {
    return res.status(403).json({ message: "Acceso denegado" });
  }
};
