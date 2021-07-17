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
Object.defineProperty(exports, "__esModule", { value: true });
const AlgorithmModel_1 = require("../models/AlgorithmModel");
const JobModel_1 = require("../models/JobModel");
const UserModel_1 = require("../models/UserModel");
const parseFunction = require('../parser');
module.exports.create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { name } = req.body;
    try {
        const currentUser = yield UserModel_1.UserModel.findOne({ publicAddress: userId });
        if (!currentUser)
            throw new Error('user not found');
        const findAlgo = yield AlgorithmModel_1.AlgorithmModel.findOne({ name });
        if (findAlgo)
            res.status(200).json(findAlgo);
        const algorithm = new AlgorithmModel_1.AlgorithmModel({ name, userId: currentUser._id });
        yield algorithm.save();
        res.status(200).json(algorithm);
    }
    catch (error) {
        if (error === 'user not found') {
            res.status(400).send({ message: 'Invalid user', error });
        }
        res.status(400).send({ message: "Can't save algorithm", error });
    }
});
module.exports.show = (req, res, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const algorithm = yield AlgorithmModel_1.AlgorithmModel.findOne({ name });
        res.status(200).json(algorithm);
    }
    catch (error) {
        res.status(400).send({ message: 'cant get the algo', error });
    }
});
module.exports.index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('hello');
        const algorithms = yield AlgorithmModel_1.AlgorithmModel.find({});
        res.status(200).json(algorithms);
    }
    catch (error) {
        res.status(400).send({ message: 'cant get all algos', error });
    }
});
module.exports.update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const algorithmId = req.params.algoId;
    try {
        const rules = req.body.parseKeys
            .map((e) => req.body.defaultKeys.includes(e.key) ? null : e.key)
            .filter((e) => e !== null);
        const output = yield parseFunction(req.body.filePath, ':', '#', rules);
        const jobFilter = { _id: req.body.jobId };
        const jobUpdate = { result: output.result };
        yield JobModel_1.JobModel.findByIdAndUpdate(jobFilter, jobUpdate);
        const updatedParseKeys = output.parseKeys.map((e) => {
            const currentElement = req.body.parseKeys.find((x) => x.key === e.key);
            return currentElement ? Object.assign(Object.assign({}, e), { visualize: currentElement.visualize }) : e;
        });
        const displayContent = updatedParseKeys.map((e) => (Object.assign(Object.assign({}, e), { value: output.result[e.key] })));
        const filter = { _id: algorithmId };
        const update = { parseKeys: updatedParseKeys, rules };
        yield AlgorithmModel_1.AlgorithmModel.findOneAndUpdate(filter, update);
        res.status(200).json(Object.assign(Object.assign({}, req.body), { result: output.result, parseKeys: displayContent, rules }));
    }
    catch (error) {
        res.status(400).send({ message: 'no no no' });
    }
});
