const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        characters: [
          {
            characterName: req.body.characterName,
            role: req.body.role,
            class: req.body.class,
            spec: req.body.spec,
          },
        ],
        experience: req.body.experience,
        about: req.body.about,
        realID: req.body.realID,
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route GET api/user/getUserInfo/:username
// @desc get information about a specific user
// @access Public
router.get("/getUserInfo/:username", (req, res) => {
  User.findOne(
    { username: req.params.username },
    { username: 1, isAdmin: 1, characters: 1 }
  ).then((user) => {
    if (user) {
      return res.json(user);
    } else {
      return res.status(400).json("User not found");
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then((user) => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }
    // Check password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          username: user.username,
        };
        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926, // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

// @route GET api/user/getUserInfo/:username
// @desc get information about a specific user
// @access Public
router.get("/getProfileInfo/:username", (req, res) => {
  User.findOne(
    { username: req.params.username },
    {
      username: 1,
      characters: 1,
      email: 1,
      experience: 1,
      about: 1,
      realID: 1,
    }
  ).then((user) => {
    if (user) {
      return res.json(user);
    } else {
      return res.status(400).json("User not found");
    }
  });
});

// @route POST api/users/updateUser
// @desc updates a user
// @access Public
router.post("/updateUser", (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const currPassword = req.body.currPassword;
  const initialEmail = req.body.initialEmail;
  //check if the email exists already if it were changed
  if (req.body.emailChanged) {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        return res.json({ detailUpdate: "EAE" });
      }
    });
  }
  //check if password was changed and if the correct current password was entered
  //if so update the password with a hash and push it in with the rest of the info
  if (req.body.currPassword !== "") {
    User.findOne({ username: username }).then((user) => {
      bcrypt.compare(currPassword, user.password).then((isMatch) => {
        if (!isMatch) {
          return res.json({ detailUpdate: "PDNM" });
        } else {
          let hashedPassword = "";
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if (err) throw err;
              hashedPassword = hash;
            });
          });
          User.updateOne(
            { username: username, email: initialEmail },
            {
              $set: {
                email: req.body.email,
                password: hashedPassword,
                realID: req.body.realID,
                experience: req.body.experience,
                about: req.body.about,
              },
            }
          )
            .then((res) => {
              return res.json("Succesfully updated user");
            })
            .catch((err) => {
              return res.json("ERR " + err);
            });
        }
      });
    });
  }
  //if it makes it to this point update the user without password update
  User.updateOne(
    { username: username, email: initialEmail },
    {
      $set: {
        email: req.body.email,
        realID: req.body.realID,
        experience: req.body.experience,
        about: req.body.about,
      },
    }
  )
    .then((res) => {
      return res.json("Succesfully updated user");
    })
    .catch((err) => {
      return res.json("ERR " + err);
    });
});

module.exports = router;
