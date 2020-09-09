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
  initialText: {
    type: String,
    required: true,
    trim: true,
  },
  threadResponses: [
    {
      responseText: {
        type: String,
        trim: true,
        minlength: 10,
        required: true,
      },
      author: {
        type: String,
        required: true,
        trim: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      uploadedImages: [
        {
          type: String,
        },
      ],
    },
  ],
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

module.exports = Forum = mongoose.model("forums", ForumSchema);
