import ProductsDAO from "../dao/class/products.dao.js";
import usersDAO from "../dao/class/users.dao.js";

export const getHomePageData = async (userId, query) => {
  let cartId = null;

  // Si el usuario está autenticado, buscar el carrito
  if (userId) {
    const user = await usersDAO.findUserById(userId);
    if (!user) {
      throw new Error("Usuario inexistente");
    }
    cartId = user.cart ? user.cart.toString() : null;
  }

  let { limit = 10, page = 1, sort, debug } = query;
  const totalProduct = await ProductsDAO.getTotalProductsCount();

  // Convertir limit a número si no es "all"
  limit = limit === "all" ? totalProduct : parseInt(limit);
  page = parseInt(page);

  // Validar los parámetros limit y page
  if (
    isNaN(page) ||
    page < 1 ||
    (limit !== undefined && (isNaN(limit) || limit < 1))
  ) {
    throw new Error("Valor de limit o page inválido");
  }

  const options = {
    limit,
    page,
    sort: sort ? { price: sort } : {},
    lean: true,
  };

  const products = await ProductsDAO.getProductsPaginated(options);

  return {
    products,
    cartId,
    debug,
  };
};
