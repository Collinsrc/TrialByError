const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MainDataSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  initialText: {
    type: String,
    required: true,
    trim: true,
  },
  uploadedImages: [
    {
      type: String,
    },
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = MainData = mongoose.model("maindatas", MainDataSchema);
