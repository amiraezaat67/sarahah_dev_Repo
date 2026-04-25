import { MessageRepository } from "../../DB/Repositories/index.js";
import messageRepository from "../../DB/Repositories/message.repository.js";

export const  sendMessage = (body)=>{
    const {content, receiverId} = body;
    return messageRepository.createDocument({content, receiverId})
}


// assume that the user is authenticated and we have the user id
export const listMyMessages = (userId) =>{
    return MessageRepository.findDocuments({receiverId: userId})
}




// Authentication - passed login api [ flow ]
// Authorization - check if user is has some permissions [ flow ]