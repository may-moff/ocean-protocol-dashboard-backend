"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlgorithmModel = void 0;
const mongoose_1 = require("mongoose");
const algorithmSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    parseKeys: [
        {
            key: String,
            dataType: String,
            visualize: Boolean
        }
    ],
    rules: [
        {
            type: [mongoose_1.Schema.Types.Mixed]
        }
    ]
});
exports.AlgorithmModel = mongoose_1.model('Algorithm', algorithmSchema);
