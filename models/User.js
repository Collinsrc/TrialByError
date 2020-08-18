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
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  characters: [
    {
      characterName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
      },
      role: {
        type: String,
        required: true,
        trim: true,
      },
      class: {
        type: String,
        required: true,
        trim: true,
      },
      spec: {
        type: String,
        required: true,
        trim: true,
      },
      isRaider: {
        type: Boolean,
        default: false,
      },
    },
  ],
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
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = User = mongoose.model("users", UserSchema);
