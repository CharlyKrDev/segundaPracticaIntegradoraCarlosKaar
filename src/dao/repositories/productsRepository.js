import productsModel from "../../data/models/products.model.js";

export const getTotalProductsCount = async () => {
  return await productsModel.countDocuments();
};

export const getProductsPaginated = async (options) => {
  return await productsModel.paginate({}, options);
};
