"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const AlgorithmModel_1 = require("../models/AlgorithmModel");
const JobModel_1 = require("../models/JobModel");
const fs = require('fs');
const parseFunction = require('../parser');
module.exports.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { algorithmId, dataName } = req.body;
    try {
        if (!req.file)
            throw new Error('file not available');
        const uploadLocation = path_1.default.join(__dirname, '/../../public/demo/', req.file.originalname);
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer)));
        const output = parseFunction(uploadLocation, ':', '#');
        const job = new JobModel_1.JobModel({
            algorithmId,
            dataName,
            userId,
            filePath: uploadLocation,
            result: output.result
        });
        yield job.save();
        const filter = { _id: algorithmId };
        const update = { parseKeys: output.parseKeys };
        yield AlgorithmModel_1.AlgorithmModel.findOneAndUpdate(filter, update);
        const displayContent = output.parseKeys.map((e) => (Object.assign(Object.assign({}, e), { value: output.result[e.key] })));
        const defaultKeys = output.parseKeys.map((e) => e.key);
        res.status(200).json({
            jobId: job._id,
            result: output.result,
            parseKeys: displayContent,
            defaultKeys,
            algorithmId,
            userId,
            dataName,
            rules: [],
            filePath: uploadLocation
        });
    }
    catch (error) {
        if (error === 'file not available')
            res.status(400).send({ message: "Can't access file", error });
        res.status(400).send({ message: "Can't save job", error });
    }
});
