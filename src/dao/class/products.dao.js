// /src/dao/products.dao.js
import productsModel from '../data/models/products.model.js';

class ProductsDAO {
  async getProductById(id) {
    return await productsModel.findById(id);
  }
}

export default new ProductsDAO();
