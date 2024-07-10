import productsDAO from "../dao/class/products.dao.js";

export const handleConnection = async (socket) => {
    console.log(`New client connected`);

    try {
        const products = await productsDAO.findProducts();
        socket.emit("currentProducts", products);
    } catch (error) {
        console.error("Error al enviar productos al cliente:", error);
        socket.emit("error", { message: "Error al procesar la solicitud" });
    }
};

export const handleAddProduct = async (socketServer, socket, newProduct) => {
    try {
        if (
            newProduct.status !== true &&
            newProduct.status !== false &&
            newProduct.status !== undefined
        ) {
            newProduct.status = true;
        }
        await productsDAO.createProduct(newProduct);
        const updatedProducts = await productsDAO.findProducts();
        socketServer.emit("updateProducts", updatedProducts);
    } catch (error) {
        console.error("Error al agregar producto:", error);
        socket.emit("error", { message: "Error al agregar producto" });
    }
};

export const handleDeleteProduct = async (socketServer, socket, productId) => {
    try {
        await productsDAO.deleteProductById(productId);
        const updatedProducts = await productsDAO.findProducts();
        socketServer.emit("updateProducts", updatedProducts);
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        socket.emit("error", { message: "Error al eliminar producto" });
    }
};
