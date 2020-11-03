const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TempUserSchema = new Schema({
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
        unique: true,
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
  confirmed: {
    type: Boolean,
    default: false,
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expireAfterSeconds: 600 },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = TempUser = mongoose.model("tempusers", TempUserSchema);
