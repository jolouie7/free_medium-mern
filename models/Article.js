const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require('slugify')
const marked = require("marked");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

// Create Schema
const ArticleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    registerDate: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    slug: { type: String, unique: true },
    sanitizedHtml: {
      type: String
    }
  },
  {
    timestamps: true,
  }
);

// Slugify the title, add 5 random strings at the end of the title
// and sanitize the incoming markdown into html
ArticleSchema.pre("save", function(next) {
  const idString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
    this.slug = this.slug + "-"
    for (let i = 0; i < 5; i++) {
      this.slug =
        this.slug +
        idString[Math.floor(Math.random() * Math.floor(idString.length))];
    }
  }

  if (this.content) {
    this.sanitizedHtml = DOMPurify.sanitize(marked(this.content))
  }

  next();
})

const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
