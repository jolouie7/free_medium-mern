const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const { update } = require("../../models/Article");
const Article = require("../../models/Article");

// @route GET api/articles
// @desc Get all articles
// @access Private
router.get("/", auth, async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: -1 });
    await res.json(articles);
    throw Error("No articles exist");
  } catch (error) {
    res.status(status).json("Error: ", error);
  }
});

// @route GET api/articles/:id
// @desc Get 1 articles
// @access Private
router.get("/:id", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    await res.json(article);
    throw Error("Error: ", Error);
  } catch (error) {
    res.status(status).json("Error: ", error);
  }
});

// @route POST api/articles
// @desc Add an article
// @access private
router.post("/", auth, async (req, res) => {
  try {
    // add tags
    const newTags = [];
    // assuming that req.body.tags is a string
    const incomingTags = req.body.tags.replace(/ /g, "");
    let word = ""
    // only works for 1 tag at a time
    for (let i = 0; i < incomingTags.length; i++) {
      if (incomingTags[i] !== "#") {
        word = word + incomingTags[i]
      }
    }
    newTags.push(word)

    const newArticle = new Article({
      title: req.body.title,
      subTitle: req.body.subTitle,
      content: req.body.content,
      tags: newTags,
      user: req.user.id,
    });
    const saveArticle = await newArticle.save()
    res.json(saveArticle)
    throw Error("Error: ", Error);
  } catch (error) {
    res.status(status).json("Error: ", error);
  }
})

// @route PATCH api/articles/:id
// @desc Update an article
// @access private
router.patch("/:id", auth, async (req, res) => {
  try {
    // const article = await Article.findById(req.params.id);
    // const tags = article.tags.push(req.body.tags)
    // ! fix so it doesn't overwrite all the tags in the array
    // ! there is a bug where in postman I have to send 2x
    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      subTitle: req.body.subTitle,
      content: req.body.content,
      tags: req.body.tags,
      user: req.user.id,
    });
    // {updatedArticle.tags = tags};
    await updatedArticle.save();
    res.json(updatedArticle);
    throw Error("Error: ", Error);
  } catch (error) {
    res.status(status).json("Error: ", error);
  }
})

// @route DELETE api/articles/:id
// @desc Delete an article
// @access private
router.delete("/:id", auth, async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id)
    await res.json("Article has been deleted!")
    throw Error("Error: ", Error)
  } catch (error) {
    res.status(status).json("Error: ", error);
  }
})

// like the article
// unlike the article
// get all comments for the article
// create a new comment
// delete the comment

module.exports = router;