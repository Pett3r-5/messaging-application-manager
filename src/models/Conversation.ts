import Message from "./Message";
import User from "./User";
import Video from "./Video";

export default interface Conversation {
    id: string
    users: User[],
    messages: Message[],
    videos: Video[]
}