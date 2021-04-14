import mongoose, { Schema } from "mongoose"
import Message from '../models/Message'
import { UserEntity } from '../schemas/UserSchema'

type MessageDocument = Message & mongoose.Document

const messageSchema = new mongoose.Schema<MessageDocument>({
    _id: {
        type: mongoose.Types.ObjectId
    },
    content: { 
        type: String, required: function(message:string):boolean { return !!message }
    },
    sentBy: { 
        type: UserEntity.schema, required: true 
    },
    createdAt: { 
        type: Date, required: true 
    },
    seen: {
        type: Boolean, required: false 
    },
    deleted: {
        type: Boolean, required: false 
    }
}, {strict: true})

const MessageEntity = mongoose.model<MessageDocument>('Message', messageSchema)

export { MessageEntity, MessageDocument }