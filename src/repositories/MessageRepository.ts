import { MessageEntity, MessageDocument } from '../schemas/MessageSchema'
import MessageModel from '../models/Message'
import mongoose from 'mongoose'

export default class MessageRepository {
    constructor(){}

    public createMessage = (message: MessageModel)=> MessageEntity.create(message)

    public updateMessage = (message: MessageModel)=> (MessageEntity.findOneAndUpdate(
            {"_id": message._id }, 
            {  "content": message.content,
                "sentBy": message.sentBy,
                "seen": message.seen || false,
                "deleted": message.deleted
            },
            {upsert: true}
        ))

    public getMessageById = (id:string)=> MessageEntity.findById(id)

    public updateUserName = (clientId:string, name:string)=> (MessageEntity.updateMany(
        {"sentBy.clientId": clientId }, 
        {   "$set": {"sentBy.name": name }}
    ))

}