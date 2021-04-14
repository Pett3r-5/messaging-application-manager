import User from "./User";
import mongoose from "mongoose";

export default interface Message {
    _id?: mongoose.Types.ObjectId
    content: string,
    sentBy: User
    createdAt: Date,
    seen: boolean,
    deleted: boolean
}