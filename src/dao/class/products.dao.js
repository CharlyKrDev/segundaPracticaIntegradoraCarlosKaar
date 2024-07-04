import productsModel from "../../data/models/products.model.js";

class ProductsDAO {
  async getProductById(id) {
    return await productsModel.findById(id);
  }
 async createProduct(fields){
  return await productsModel.create(fields)
 }
  async getProductsLimit(limit){
    return await productsModel.find().limit(limit)
  }
  async getProducts(){
    return await productsModel.find().limit()
  }
  async getProductByCode(code){
    return await productsModel.find(code)
  }

  async updateOneProduct(productId, updateFields){

    return await productsModel.updateOne({ _id: productId }, updateFields )
  }

  async deleteProductById (productId){
    await productsModel.deleteOne({_id:productId})
  }

  async getTotalProductsCount () {
    return await productsModel.countDocuments();
  };
  
  async getProductsPaginated (options)  {
    return await productsModel.paginate({}, options);
  };
}

export default new ProductsDAO();
