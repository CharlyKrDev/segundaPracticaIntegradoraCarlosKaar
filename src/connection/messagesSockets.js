import { connectionMessages } from "../services/messagesServices.js";

export const messagesConnection = (socketServer) => {
    console.log('Message client connected');
    socketServer.on("connection", connectionMessages(socketServer));
};



