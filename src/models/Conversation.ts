import Message from "./Message";
import User from "./User";
import Video from "./Video";

export default interface Conversation {
    conversationLink: string
    users: User[],
    messages: Message[]
}