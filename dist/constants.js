"use strict";
exports.__esModule = true;
exports.chatServiceBaseUrl = void 0;
require('dotenv').config();
exports.chatServiceBaseUrl = {
    local: process.env.LOCAL_BASE_URL,
    prod: process.env.PROD_BASE_URL
};
