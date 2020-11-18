const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Article = require("../../models/Article");
const Comment = require("../../models/Comment");

// @route GET api/articles
// @desc Get all articles
// @access Private
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find();
    // const articles = await Article.find().sort({ date: -1 });
    await res.json(articles);
    throw Error("No articles exist");
  } catch (error) {
    res.status(status).json("Error: ", error);
    // res.status(400).json("Error: ", error)
  }
});

// @route GET api/articles/:slug
// @desc Get 1 unique blog post
// @access Public
router.get("/:slug", async (req, res, next) => {
  try {
    const article = await Article.fineOne({slug: {$eq: req.params.slug}}, async (err, article) => {
      await res.json(article)
      if (err) return next(err);
    });
  } catch (err) {
    res.status(400).json({error: err});
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
    res.status(400).json({ error: err });
  }
})

// @route PUT api/articles/like
// @desc like an article
// @access Private
router.put("/like", auth, (req, res) => {
  Article.findByIdAndUpdate(
    req.body.articleId,
    {
      $push: { likes: req.user.id },
    },
    {
      new: true,
    }
  ).exec((err, response) => {
    if (err) return res.status(422).json({ error: err });
    User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { likes: req.body.articleId },
      },
      {
        new: true,
      }
    ).exec((err, response) => {
      if (err) return res.status(422).json({ error: err });
      res.json(response);
    });
  });
});

// @route PUT api/articles/unlike
// @desc like an article
// @access Private
router.put("/unlike", auth, (req, res) => {
  Article.findByIdAndUpdate(req.body.articleId, {
    $pull: {likes:req.user.id}
  }, {
    new: true
  }).exec((err, response) => {
    if(err) return res.status(422).json({error:err})
    User.findByIdAndUpdate(req.user.id, {
      $pull: {likes: req.body.articleId}
    }, {
      new: true
    }).exec((err, response) => {
      if (err) return res.status(422).json({ error: err });
      res.json(response)
    })
  })
});

// @route PUT api/articles/:id
// @desc Update an article
// @access private
router.put("/:id", auth, (req, res) => {
  try {
    Article.findByIdAndUpdate(req.body.articleId, req.body, {
      new: true
    }).exec((err, response) => {
      if (err) return res.status(400).json({error: err})
      res.json(response)
    })
  } catch (err) {
    console.log("Error: ", err)
    res.status(400).json({error: err});
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
    res.status(400).json({ error: err });
  }
})

// @route GET api/articles/comments/allComments
// @desc Get all comments
// @access private
router.get("/comments/allComments", async (req, res) => {
  try {
    const comments = await Comment.find();
    await res.json(comments)
    throw Error("Error: ", Error)
  } catch (error) {
    res.status(400).json({ error: err });
  }
})

// @route POST api/articles/comments
// @desc Add new comment
// @access private
router.post("/comments", auth, async (req, res) => {
  try {
    const newComment = new Comment({
      content: req.body.content,
      article: req.body.article,
      user: req.user.id,
    });
    const saveComment = await newComment.save();
    res.json(saveComment)
    throw Error("Error: ", Error);
  } catch (error) {
    res.status(400).json({ error: err });
  }
});

// @route DELETE api/articles/comments/:id
// @desc Delete comment
// @access private
router.delete("/comments/:id", auth, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id)
    await res.json("Comment has been deleted!")
    throw Error("Error: ", Error)
  } catch (error) {
    res.status(400).json({ error: err });
  }
})

module.exports = router;