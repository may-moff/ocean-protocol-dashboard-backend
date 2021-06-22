const crypto = require('crypto');
import { Schema, model } from 'mongoose';

export interface IUser {
  _id: string;
  nonce: number;
  publicAddress: string;
  // get back on this to verify how to make it work better
  save(): any;
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
