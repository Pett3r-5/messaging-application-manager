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

    public getConversationsByClientId = (clientId: string)=> this.conversationRepository.getConversationsByClientId(clientId)

    public getConversationById = (id: string):mongoose.Query<ConversationDocument | null, ConversationDocument>=> (
        this.conversationRepository.getConversationById(id))

    public getConversationByUrlLink = (conversationLink: string)=> this.conversationRepository.getConversationByUrlLink(conversationLink)

    public addUserByConversationLink(conversationLink:string, user: User) {
        user.isConversationOwner = false;
        user.isOnline = true;
        return this.conversationRepository.addUserByConversationLink(conversationLink, user)
    }

    public save= (conversation: ConversationModel)=> this.conversationRepository.save(conversation)
    
    public updateUserName = (id:string, name:string)=> this.conversationRepository.updateUserName(id, name)

    public deleteConversation= (id:string)=> this.conversationRepository.deleteConversation(id)
}