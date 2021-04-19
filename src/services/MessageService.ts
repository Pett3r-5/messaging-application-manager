import { MessageEntity, MessageDocument } from '../schemas/MessageSchema'
import MessageModel from '../models/Message'
import mongoose, { Schema } from 'mongoose'
import MessageRepository from '../repositories/MessageRepository'

export default class MessageService {
    public messageRepository:MessageRepository

    constructor(messageRepository:MessageRepository){
        this.messageRepository = messageRepository
    }

    public createMessage(message: MessageModel) {
        if(!message) {
            return Promise.reject("empty Message to be saved")
        }
        message._id = new mongoose.Types.ObjectId()
        message.createdAt = new Date()
        message.seen = false;
        message.deleted = false;
        return this.messageRepository.createMessage(message)
    }

    public updateMessage(message: MessageModel) {
        return this.messageRepository.updateMessage(message)
    }

    public getMessageById(id:string) {
        return this.messageRepository.getMessageById(id)
    }

    public populateMessages(messages: Array<Schema.Types.ObjectId | string>) {
        let messageRequests: any = []
        messageRequests = messages.map((el: any) => this.messageRepository.getMessageById(String(el)))
        return Promise.all(messageRequests)
    }

}