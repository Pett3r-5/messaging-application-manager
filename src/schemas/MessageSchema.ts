import mongoose, { Schema } from "mongoose"
import Message from '../models/Message'
import User from '../models/User'

type MessageDocument = Message & mongoose.Document

const messageSchema = new mongoose.Schema<MessageDocument>({
    content: { 
        type: String, required: function(message:string):boolean { return !!message }
    },
    sentBy: [{ 
        type: User, required: true 
    }],
    createdAt: { 
        type: Date, required: true 
    },
    seenAt: {
        type: Date, required: false 
    }
}, {strict: true})

const Message = mongoose.model<MessageDocument>('Cafe', messageSchema)

export { Message, MessageDocument }