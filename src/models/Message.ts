import User from "./User";

export default interface Message {
    content: string,
    sentBy: User
    createdAt: Date,
    seenAt: Date
}