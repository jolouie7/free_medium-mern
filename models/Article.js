const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slugify = require('slugify')
const nanoid = require('nanoid')
const marked = require("marked");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);
// Instead of a custom slugify function, we can use the library slugify

// const clean = DOMPurify.sanitize(dirty);

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
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

// ! not using anymore
// function slugify(text) {
//   return text
//     .toString()
//     .toLowerCase()
//     .replace(/\s+/g, "-") // replace spaces with -
//     .replace(/[^\w\-]+/g, "") // remove all non-word chars
//     .replace(/\-\-+/g, "-") // replace multiple - with single -
//     .replace(/^-+/, "") // trim - from start of text
//     .replace(/-+$/, ""); // trim - from end of text
// }

// make sure that the slug is created from the title
ArticleSchema.pre("save", function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + `-${nanoid(10)}`;
  }

  next();
})

const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
