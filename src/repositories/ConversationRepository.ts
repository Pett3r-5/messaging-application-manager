import { ConversationEntity, ConversationDocument } from '../schemas/ConversationSchema'
import ConversationModel from '../models/Conversation'
import mongoose from 'mongoose'

export default class ConversationRepository {
    constructor(){}

    public getConversationByUser(clientId: string) {
        return ConversationEntity.findOne({ "users.clientId": clientId }).populate('messages.message')
    }

    public getConversationByUrlLink(conversationLink: string) {
        return ConversationEntity.findOne({ "conversationLink": conversationLink }).populate('messages.message')
    }

    public save(conversation: ConversationModel) {
        if(!conversation) {
            return Promise.reject("empty conversation to be saved")
        }
        
        if(!conversation._id){
            conversation._id = new mongoose.Types.ObjectId()
            return ConversationEntity.create(conversation)
        }
        return ConversationEntity.findOneAndUpdate(
            {"_id": conversation._id }, 
            {  "conversationLink": conversation.conversationLink,
                "users": conversation.users,
                "messages": conversation.messages
            },
            {upsert: true}
        )
    }

    public deleteConversation(id:string) {
        return ConversationEntity.findByIdAndDelete(id)
    }
}