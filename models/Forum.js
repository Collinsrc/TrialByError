const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ForumSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  initalText: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
  },
  threadResponses: [
    {
      responseText: {
        type: String,
        trim: true,
        minlength: 10,
      },
    },
  ],
});

module.exports = Forum = mongoose.model("forums", ForumSchema);
