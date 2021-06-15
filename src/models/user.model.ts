const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  nonce: {
    type: Number,
    default: () => Math.floor(Math.random() * 1000000),
    required: true,
  },
  publicAddress: { type: String, unique: true, required: true },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
