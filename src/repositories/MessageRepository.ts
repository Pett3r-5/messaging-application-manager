import { MessageEntity, MessageDocument } from '../schemas/MessageSchema'
import MessageModel from '../models/Message'
import mongoose from 'mongoose'

export default class MessageRepository {
    constructor(){}

    public createMessage(message: MessageModel) {
        if(!message) {
            return Promise.reject("empty Message to be saved")
        }
        message._id = new mongoose.Types.ObjectId()
        message.createdAt = new Date()
        message.seen = false;
        message.deleted = false;
        return MessageEntity.create(message)
    }

    public updateMessage(message: MessageModel) {
        return MessageEntity.findOneAndUpdate(
            {"_id": message._id }, 
            {  "content": message.content,
                "sentBy": message.sentBy,
                "seen": message.seen || false,
                "deleted": message.deleted
            },
            {upsert: true}
        )
    }

    public getMessageById(id:string) {
        return MessageEntity.findById(id)
    }

}