import {
  handleConnection,
  handleAddProduct,
  handleDeleteProduct
} from "../controllers/socketControllers.js";

export const socketConnection = (socketServer) => {
  socketServer.on("connection", (socket) => {
      handleConnection(socket);

      socket.on("addProduct", (newProduct) => {
          handleAddProduct(socketServer, socket, newProduct);
      });

      socket.on("deleteProduct", (productId) => {
          handleDeleteProduct(socketServer, socket, productId);
      });
  });
};
