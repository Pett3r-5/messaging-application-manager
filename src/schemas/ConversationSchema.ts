import { ObjectId } from "bson"
import mongoose, { Schema } from "mongoose"
import Conversation from '../models/Conversation'
import User from '../models/User'
import { UserEntity } from '../schemas/UserSchema'

type ConversationDocument = Conversation & mongoose.Document

const conversationSchema = new mongoose.Schema<ConversationDocument>({
    _id: {
        type: mongoose.Types.ObjectId
    },
    conversationLink: { 
        type: String, required: true 
    },
    users: [{ 
        type: UserEntity.schema, required: true 
    }],
    messages: [{ 
        type: Schema.Types.ObjectId, ref: "Message", required: true 
    }]
}, {strict: true})

const ConversationEntity = mongoose.model<ConversationDocument>('Conversation', conversationSchema)

export { ConversationEntity, ConversationDocument }