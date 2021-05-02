"use strict";
exports.__esModule = true;
var User = /** @class */ (function () {
    function User(clientId, name, isConversationOwner, isOnline) {
        this.name = name;
        this.clientId = clientId;
        this.isConversationOwner = isConversationOwner;
        this.isOnline = isOnline;
    }
    return User;
}());
exports["default"] = User;
