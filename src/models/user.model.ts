// const mongoose = require('mongoose');
const crypto = require('crypto');
// const Schema = mongoose.Schema;

// export interface IUser {
//   nonce: number;
//   publicAddress: string;
// }

// const userSchema = new Schema({
//   nonce: {
//     type: Number,
//     default: () => crypto.randomInt(10000, 100000000),
//     required: true,
//   },
//   publicAddress: { type: String, unique: true, required: true },
// });

// export const User = mongoose.model<IUser>('User', userSchema);

import { Schema, model } from 'mongoose';

export interface IUser {
  _id: string;
  nonce: number;
  publicAddress: string;
}

const userSchema = new Schema<IUser>({
  nonce: {
    type: Number,
    default: () => crypto.randomInt(10000, 100000000),
    required: true,
  },
  publicAddress: { type: String, unique: true, required: true },
});

export const UserModel = model<IUser>('User', userSchema);
