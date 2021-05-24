"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var uuid_1 = require("uuid");
var axios_1 = __importDefault(require("axios"));
var app_1 = require("../app");
require('dotenv').config();
var chatServiceBaseUrl = process.env.LOCAL_BASE_URL;
if (process.env.NODE_ENV === 'prod') {
    chatServiceBaseUrl = process.env.PROD_BASE_URL;
}
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var server, io, thisUser;
        var _this = this;
        return __generator(this, function (_a) {
            server = app_1.app.listen(5001);
            io = require('socket.io')(server, {
                cors: {
                    origin: '*',
                    methods: ["GET", 'OPTIONS', "POST"],
                    credentials: true,
                    transport: ['websocket']
                }
            });
            console.log('-----------------------------started---------------------------');
            io.on('connection', function (socket) {
                socket.on("user-id", function (id) {
                    thisUser = id;
                });
                socket.on("create-conversation", function (event) { return __awaiter(_this, void 0, void 0, function () {
                    var uuid, data, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                thisUser = event.users[0].clientId;
                                console.log("create-conversation");
                                console.log(event);
                                if (!!!event) return [3 /*break*/, 4];
                                uuid = uuid_1.v4();
                                event.conversationLink = uuid;
                                event.users[0].isOnline = true;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, axios_1["default"].post(chatServiceBaseUrl + "/conversation", event)];
                            case 2:
                                data = (_a.sent()).data;
                                socket.join(uuid);
                                socket.room = uuid;
                                io.to(uuid).emit("conversation-joined", { conversation: __assign({}, data), isOpenedConversation: true });
                                return [3 /*break*/, 4];
                            case 3:
                                error_1 = _a.sent();
                                console.log(error_1);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                socket.on("post-message", function (event) { return __awaiter(_this, void 0, void 0, function () {
                    var data, updatedConv, error_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                thisUser = event.message.sentBy.clientId;
                                if (!!!event) return [3 /*break*/, 5];
                                event.message.sentBy.isOnline = true;
                                event.message.seen = false;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, axios_1["default"].post(chatServiceBaseUrl + "/message", event.message)];
                            case 2:
                                data = (_a.sent()).data;
                                event.conversation.messages = event.conversation.messages.map(function (message) { return message._id; });
                                event.conversation.messages.push(data._id);
                                event.conversation.users = event.conversation.users.map(function (el) {
                                    if (el.clientId === event.message.sentBy.clientId) {
                                        el.isOnline = true;
                                    }
                                    return el;
                                });
                                return [4 /*yield*/, axios_1["default"].put(chatServiceBaseUrl + "/conversation", event.conversation)];
                            case 3:
                                updatedConv = _a.sent();
                                io.to(updatedConv.data.conversationLink).emit("message-posted", __assign({}, updatedConv.data));
                                return [3 /*break*/, 5];
                            case 4:
                                error_2 = _a.sent();
                                console.log(error_2);
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
                socket.on('join-conversation', function (event) { return __awaiter(_this, void 0, void 0, function () {
                    var data, error_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                thisUser = event.user.clientId;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, axios_1["default"].put(chatServiceBaseUrl + "/conversation/users?conversationLink=" + event.conversationLink, event.user)];
                            case 2:
                                data = (_a.sent()).data;
                                if (!!data) {
                                    socket.room = event.conversationLink;
                                    socket.join(event.conversationLink);
                                    io.to(event.conversationLink).emit("conversation-joined", {
                                        conversation: {
                                            _id: data._id,
                                            conversationLink: data.conversationLink,
                                            messages: data.messages,
                                            subject: data.subject,
                                            isPublic: data.isPublic,
                                            persist: data.persist,
                                            users: data.users
                                        },
                                        isOpenedConversation: event.isOpenedConversation
                                    });
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                error_3 = _a.sent();
                                console.log(error_3);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                socket.on("get-conversation", function (event) { return __awaiter(_this, void 0, void 0, function () {
                    var data, error_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, axios_1["default"].get(chatServiceBaseUrl + "/conversation/conversationLink/" + event.conversationLink)];
                            case 1:
                                data = (_a.sent()).data;
                                if (!!data) {
                                    io.to(event.conversationLink).emit("conversation-joined", {
                                        conversation: {
                                            _id: data._id,
                                            conversationLink: data.conversationLink,
                                            messages: data.messages,
                                            users: data.users,
                                            subject: data.subject || "",
                                            isPublic: data.isPublic || true,
                                            persist: data.isPublic || false
                                        },
                                        isOpenedConversation: true
                                    });
                                }
                                return [3 /*break*/, 3];
                            case 2:
                                error_4 = _a.sent();
                                console.log(error_4);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                socket.on('leave-conversation', function (conversationLink) {
                    socket.leave(conversationLink);
                });
                socket.on('disconnect', function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var persistRes, deletions, data, error_5, error_6;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    deletions = [];
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, axios_1["default"].get(chatServiceBaseUrl + "/conversation/persist-false/clientId/" + thisUser)];
                                case 2:
                                    data = (_a.sent()).data;
                                    persistRes = data;
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_5 = _a.sent();
                                    console.log(error_5);
                                    return [3 /*break*/, 4];
                                case 4:
                                    if (!(persistRes && persistRes.length > 0)) return [3 /*break*/, 8];
                                    persistRes.forEach(function (el) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            if (!io.sockets.adapter.rooms.get(el.conversationLink)) {
                                                deletions.push(axios_1["default"]["delete"](chatServiceBaseUrl + "/conversation/conversationLink/" + el.conversationLink));
                                            }
                                            return [2 /*return*/];
                                        });
                                    }); });
                                    _a.label = 5;
                                case 5:
                                    _a.trys.push([5, 7, , 8]);
                                    return [4 /*yield*/, Promise.all(deletions)];
                                case 6:
                                    _a.sent();
                                    return [3 /*break*/, 8];
                                case 7:
                                    error_6 = _a.sent();
                                    console.log(error_6);
                                    return [3 /*break*/, 8];
                                case 8: return [2 /*return*/];
                            }
                        });
                    });
                });
            });
            console.log(parseInt(process.env.PORT || '5000'));
            io.listen(parseInt(process.env.PORT || '5000'));
            return [2 /*return*/];
        });
    });
}
init();
