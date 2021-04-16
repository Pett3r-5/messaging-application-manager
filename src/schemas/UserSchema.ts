
import mongoose, { Schema } from "mongoose"
import User from '../models/User'

type UserDocument = User & mongoose.Document

const userSchema = new mongoose.Schema<UserDocument>({
    clientId: { 
        type: String, required: true 
    },
    name: { 
        type: String, required: true 
    },
    isConversationOwner: { 
        type: Boolean, required: false 
    },
    isOnline: { 
        type: Boolean, required: true 
    }
}, {strict: true})

const UserEntity = mongoose.model<UserDocument>('User', userSchema)

export { UserEntity, UserDocument }