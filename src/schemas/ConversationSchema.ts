import mongoose, { Schema } from "mongoose"
import Conversation from '../models/Conversation'
import User from '../models/User'

type ConversationDocument = Conversation & mongoose.Document

const conversationSchema = new mongoose.Schema<ConversationDocument>({
    conversationLink: { 
        type: String, required: true 
    },
    users: [{ 
        type: User, required: true 
    }],
    messages: [{ 
        type: Schema.Types.ObjectId, ref: "Message", required: true 
    }]
}, {strict: true})

const Conversation = mongoose.model<ConversationDocument>('Cafe', conversationSchema)

export { Conversation, ConversationDocument }