import { ConversationEntity, ConversationDocument } from '../schemas/ConversationSchema'
import ConversationModel from '../models/Conversation'
import mongoose, { Model } from 'mongoose'
import User from '../models/User'
import ConversationRepository from '../repositories/ConversationRepository'

export default class ConversationService {
    public conversationRepository:ConversationRepository

    constructor(conversationRepository:ConversationRepository){
        this.conversationRepository = conversationRepository;
    }

    public getConversationsByClientId(clientId: string) {
        return this.conversationRepository.getConversationsByClientId(clientId)
    }

    public getConversationById(id: string):mongoose.Query<ConversationDocument | null, ConversationDocument> {
        return this.conversationRepository.getConversationById(id)
    }

    public getConversationByUrlLink(conversationLink: string) {
        return this.conversationRepository.getConversationByUrlLink(conversationLink)
    }

    public addUserByConversationLink(conversationLink:string, user: User) {
        user.isConversationOwner = false;
        user.isOnline = true;
        return this.conversationRepository.addUserByConversationLink(conversationLink, user)
    }

    public save(conversation: ConversationModel) {
        return this.conversationRepository.save(conversation)
    }

    public deleteConversation(id:string) {
        return this.conversationRepository.deleteConversation(id)
    }
}