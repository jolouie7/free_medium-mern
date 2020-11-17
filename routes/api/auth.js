const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

// User Model
const User = require("../../models/User");

// @route POST api/auth/login
// @desc Authenticate user
// @access Public
router.post("/login", (req, res) => {
  const { password, username } = req.body;

  // Simple validation
  if (!password || !username) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check for existing user
  User.findOne({ username: username }).then((user) => {
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    // Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

      jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: 86400 }, // expires in 24hours
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              username: user.username,
              image: user.image,
            },
          });
        }
      );
    });
  });
});

// @route POST api/auth/register
// @desc Register new user
// @access Public
router.post("/register", (req, res) => {
  const { name, email, password, username } = req.body;

  // Simple validation
  if (!name || !email || !password || !username) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check for existing user
  User.findOne({ email: email, username: username }).then((user) => {
    console.log("users error: ", user);
    if (user) return res.status(400).json({ msg: "User already exist" });

    const newUser = new User({
      name,
      email,
      username,
      password,
    });

    // Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: 86400 }, // expires in 24hours
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  username: user.username,
                },
              });
            }
          );
        });
      });
    });
  });
});

// @route GET api/auth/user
// @desc Get user data
// @access Private
router.get("/user", auth, (req, res) => {
  try {
    User.findById(req.user.id)
      .select("-password") // return everything except password
      .then((user) => res.json(user));
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

module.exports = router;