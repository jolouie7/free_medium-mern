const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    registerDate: {
      type: Date,
      default: Date.now,
    },
    article: {
      type: Schema.Types.ObjectId,
      ref: "Article",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;
