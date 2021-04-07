"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var www_1 = __importDefault(require("../bin/www"));
var io = require('socket.io')(www_1["default"]);
io.on('connection', function (socket) {
    console.log("socket connected");
    socket.emit('request', {}); // emit an event to the socket
    io.emit('broadcast', {}); // emit an event to all connected sockets
    socket.on('reply', function () { return replyAction(); }); // listen to the event
});
var replyAction = function () {
    {
        console.log("replied");
    }
};
