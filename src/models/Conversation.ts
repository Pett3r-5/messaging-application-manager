import mongoose, { Schema, Types } from "mongoose";
import Message from "./Message";
import User from "./User";
import Video from "./Video";

export default interface Conversation {
    _id?: mongoose.Types.ObjectId
    conversationLink: string
    subject?:string
    isPublic?:boolean
    persist?:boolean
    users: User[]
    messages: Types.ObjectId[] | string[]
}