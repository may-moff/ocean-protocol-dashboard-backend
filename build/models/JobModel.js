"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModel = void 0;
const mongoose_1 = require("mongoose");
const jobSchema = new mongoose_1.Schema({
    algorithmId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Algorithm'
    },
    dataName: {
        type: String,
        // default: () => Math.floor(Math.random() * 100),
        required: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    filePath: {
        type: String
    },
    // make this object
    result: {
        type: [mongoose_1.Schema.Types.Mixed]
    }
});
exports.JobModel = mongoose_1.model('Job', jobSchema);
