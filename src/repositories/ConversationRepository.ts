import { ConversationEntity, ConversationDocument } from '../schemas/ConversationSchema'
import ConversationModel from '../models/Conversation'
import mongoose, { Model } from 'mongoose'
import User from '../models/User'

export default class ConversationRepository {
    constructor(){}

    public getConversationsByClientId(clientId: string) {
        return ConversationEntity.find({ "users.clientId": clientId })
    }

    public getConversationById(id: string):mongoose.Query<ConversationDocument | null, ConversationDocument> {
        return ConversationEntity.findById(id)
    }

    public getConversationByUrlLink(conversationLink: string) {
        return ConversationEntity.findOne({ "conversationLink": conversationLink })
    }

    public addUserByConversationLink(conversationLink:string, user: User) {
        
        return ConversationEntity.findOneAndUpdate({ "conversationLink": conversationLink },
        {$push: 
            {   
                clientId: user.clientId,
                name: user.name,
                isConversationOwner: false,
                isOnline: true 
            } 
        }
        )
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