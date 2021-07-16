import { Schema, model } from 'mongoose'

export interface IUser {
  _id: string
  nonce: number
  publicAddress: string
  save(): any
}

const userSchema = new Schema<IUser>({
  nonce: {
    type: Number,
    default: () => Math.floor(Math.random() * 10000),
    required: true
  },
  publicAddress: { type: String, unique: true, required: true }
})

export const UserModel = model<IUser>('User', userSchema)
