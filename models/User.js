const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  characterName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 25,
  },
  experience: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  about: {
    type: String,
    required: false,
    trim: true,
    maxlength: 500,
  },
  realID: {
    type: String,
    required: false,
    trim: true,
    maxlength: 50,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isRaider: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("users", UserSchema);
