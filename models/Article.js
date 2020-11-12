const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    slug: { type: String },
  },
  {
    timestamps: true,
  }
);

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/[^\w\-]+/g, "") // remove all non-word chars
    .replace(/\-\-+/g, "-") // replace multiple - with single -
    .replace(/^-+/, "") // trim - from start of text
    .replace(/-+$/, ""); // trim - from end of text
}

// make sure that the slug is created from the title
ArticleSchema.pre("save", function(next) {
  this.slug = slugify(this.title);
  next();
})

const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
