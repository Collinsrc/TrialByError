const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
// Load input validation
const validateLoginInput = require("../../validation/login");
// Load User model
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      User.findOne({ "characters.characterName": req.body.characterName }).then(
        (user) => {
          if (user) {
            return res.json({ register: "CAE" });
          } else {
            User.findOne({ username: req.body.username }).then((user) => {
              if (user) {
                return res.json({ register: "UAE" });
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
          }
        }
      );
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
  //check if the email exists already if it were changed AND the password was not changed
  if (req.body.emailChanged && req.body.currPassword === "") {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        return res.json({ detailUpdate: "EAE" });
      } else {
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
          .then(() => {
            return res.json("Succesfully updated user");
          })
          .catch((err) => {
            return res.json("ERR " + err);
          });
      }
    });
  }
  //check if password was changed and if the correct current password was entered
  //if so update the password with a hash and push it in with the rest of the info
  else if (req.body.currPassword !== "") {
    //check if email had been changed
    User.findOne({ email: email }).then((user) => {
      if (user && req.body.emailChanged) {
        return res.json({ detailUpdate: "EAE" });
      } else {
        User.findOne({ username: username }).then((user) => {
          bcrypt.compare(currPassword, user.password).then((isMatch) => {
            if (!isMatch) {
              return res.json({ detailUpdate: "PDNM" });
            } else {
              bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                  if (err) {
                    throw err;
                  } else {
                    User.updateOne(
                      { username: username, email: initialEmail },
                      {
                        $set: {
                          email: req.body.email,
                          password: hash,
                          realID: req.body.realID,
                          experience: req.body.experience,
                          about: req.body.about,
                        },
                      }
                    )
                      .then(() => {
                        return res.json("Succesfully updated user");
                      })
                      .catch((err) => {
                        return res.json("ERR " + err);
                      });
                  }
                });
              });
            }
          });
        });
      }
    });
  } else {
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
      .then(() => {
        return res.json("Succesfully updated user");
      })
      .catch((err) => {
        return res.json("ERR " + err);
      });
  }
});

// @route POST api/user/updateCharacter
// @desc update a users character
// @access Public
router.post("/updateCharacter", (req, res) => {
  User.updateOne(
    {
      username: req.body.username,
      "characters.$.characterName": req.body.characterName,
    },
    {
      $set: {
        "characters.$.spec": req.body.spec,
        "characters.$.role": req.body.role,
      },
    }
  )
    .then(() => {
      return res.json("Succesfully updated user");
    })
    .catch((err) => {
      console.log(err);
      return res.json("ERR " + err);
    });
});

// @route POST api/user/addCharacter
// @desc adds a character
// @access Public
router.post("/addCharacter", (req, res) => {
  User.findOne({ "characters.characterName": req.body.characterName }).then(
    (user) => {
      if (user) {
        return res.json({ detailUpdate: "CAE" });
      } else {
        User.updateOne(
          {
            username: req.body.username,
          },
          {
            $push: {
              characters: {
                characterName: req.body.characterName,
                role: req.body.role,
                class: req.body.class,
                spec: req.body.spec,
              },
            },
          }
        )
          .then(() => {
            return res.json("Succesfully updated user");
          })
          .catch((err) => {
            return res.json("ERR " + err);
          });
      }
    }
  );
});

//@route GET api/user/getAllUsers
//@desc returns all of the data in the user document
//@access public
router.get("/getAllUsers", (req, res) => {
  User.find()
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      return res.json("ERR " + err);
    });
});

module.exports = router;
