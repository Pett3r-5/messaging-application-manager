

export default class User {
    clientId: string
    name: string
    isConversationOwner?: boolean
    isOnline?: boolean

    constructor(clientId: string, name: string, isConversationOwner: boolean, isOnline: boolean){
            this.name = name;
            this.clientId = clientId
            this.isConversationOwner= isConversationOwner
            this.isOnline = isOnline
    }
}