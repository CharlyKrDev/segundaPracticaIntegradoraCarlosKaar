import messagesModel from "../../data/models/messages.models.js";


class MessagesDAO {

    async existingUser(user) {
        
        return  await messagesModel.findOne({ user })
    
    }
    async createMessages (user, message){

        return messagesModel.create({ user, messages: [message] })
    }



}
 
export default new MessagesDAO();
