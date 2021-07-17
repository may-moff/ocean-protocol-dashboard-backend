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
const UserModel_1 = require("../models/UserModel");
module.exports.find = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // If a query string ?publicAddress=... is given, then filter results
    const address = req.query && req.query.publicAddress
        ? { publicAddress: req.query.publicAddress }
        : undefined;
    try {
        const users = yield UserModel_1.UserModel.find(address);
        res.json(users);
    }
    catch (error) {
        console.log(error);
        next();
    }
});
module.exports.create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { publicAddress } = req.body;
    try {
        const newUser = new UserModel_1.UserModel({ publicAddress });
        yield newUser.save();
        res.json(newUser);
    }
    catch (error) {
        console.log(error);
        next();
    }
});
module.exports.get = (req, res, next) => {
    // AccessToken payload is in req.user.payload, especially its `id` field
    // UserId is the param in /users/:userId
    // We only allow user accessing herself, i.e. require payload.id==userId
    if (req.user.payload.id !== +req.params.userId) {
        return res.status(401).send({ error: 'You can can only access yourself' });
    }
    return UserModel_1.UserModel.findById(req.params.userId)
        .then((user) => res.json(user))
        .catch(next);
};
module.exports.patch = (req, res, next) => {
    // Only allow to fetch current user
    if (req.user.payload.id !== +req.params.userId) {
        return res.status(401).send({ error: 'You can can only access yourself' });
    }
    return UserModel_1.UserModel.findById(req.params.userId)
        .then((user) => {
        if (!user) {
            return user;
        }
        Object.assign(user, req.body);
        return user.save();
    })
        .then((user) => {
        return user
            ? res.json(user)
            : res.status(401).send({
                error: `User with publicAddress ${req.params.userId} is not found in database`
            });
    })
        .catch(next);
};
