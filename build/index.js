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
const UserModel_1 = require("./models/UserModel");
const connection = require('./db-config');
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');
const routes = require('./routes');
app.use(cors());
app.use(express.json());
connection();
app.get('/', (req, res) => {
    res.send('Main route working');
});
app.use('/api', routes);
app.post('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { publicAddress } = req.body;
    try {
        const newUser = new UserModel_1.UserModel({ publicAddress });
        yield newUser.save();
        res.send('User saved');
    }
    catch (error) {
        console.log(error);
    }
}));
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
