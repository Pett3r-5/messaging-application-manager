

export default class User {
    clientId: string
    name: string
    isConversationOwner: boolean

    constructor(clientId: string,
        name: string,
        isConversationOwner: boolean){
            this.name = name;
            this.clientId = clientId
            this.isConversationOwner= isConversationOwner
    }
}