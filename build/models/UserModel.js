"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    nonce: {
        type: Number,
        default: () => Math.floor(Math.random() * 10000),
        required: true
    },
    publicAddress: { type: String, unique: true, required: true }
});
exports.UserModel = mongoose_1.model('User', userSchema);
