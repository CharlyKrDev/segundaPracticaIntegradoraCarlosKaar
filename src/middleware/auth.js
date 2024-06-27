import cartsModel from "../dao/models/carts.models.js";


export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/current');
    }
};

// Carrito

export const isCartOwner = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const userId = req.user._id;
console.log(userId.cart)
    const cart = await cartsModel.findById(cid);
console.log(cart)
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    if (cart.user !== userId) {
      return res.status(403).json({ message: "No tienes permiso para acceder a este carrito" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error al verificar la propiedad del carrito", error: error.message });
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