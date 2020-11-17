const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

// User Model
const User = require("../../models/User");

// @route GET api/users
// @desc Get all users
// @access Public
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) throw Error("No users exist");
    res.json(users);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

// @route PUT api/users/follow
// @desc Current User follows another user
// @access Private
router.put("/follow", auth, (req, res) => {
  //find the id of the other user and push the currentUser's ID into their followers array
  User.findByIdAndUpdate(
    req.body.id,
    {
      $push: { followers: req.user.id },
    },
    {
      new: true,
    }
  ).exec((err, response) => {
    if (err) return res.status(400).json({ error: err });
    //find the id of the currentUser and push the ID of the other user from the following array
    User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { following: req.body.id },
      },
      {
        new: true,
      }
    ).exec((err, response) => {
      if (err) return res.status(400).json({ error: err });
      res.json(response);
    });
  });
});

// @route PUT api/users/unfollow
// @desc Current User unfollows another user
// @access Private
router.put("/unfollow", auth, (req, res) => {
  //find the id of the other user and pull the currentUser's ID into their followers array
  User.findByIdAndUpdate(
    req.body.id,
    {
      $pull: { followers: req.user.id },
    },
    {
      new: true,
    }
  ).exec((err, response) => {
    if (err) return res.status(400).json({ error: err });
    //find the id of the currentUser and pull the ID of the other user from the following array
    User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { following: req.body.id },
      },
      {
        new: true,
      }
    ).exec((err, response) => {
      if (err) return res.status(400).json({ error: err });
      res.json(response);
    });
  });
});

// @route PATCH api/users/:id
// @desc Update user data
// @access Private
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body);
    await updatedUser.save();
    res.json(updatedUser);
    throw Error("Error: ", Error);
  } catch (error) {
    res.status(status).json("Error: ", error);
    // res.status(400).json("Error: ", error);
  }
});

module.exports = router;