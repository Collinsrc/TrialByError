const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Forum = require("../../models/Forum");
const User = require("../../models/User");

// @route POST api/administrative/deleteCharacter
// @desc removes a character from the database
// @access Public
router.post("/deleteCharacter", (req, res) => {
  let forumsCreated = [];
  let responses = [];
  let imageNames = [];

  //Get all images that the user may have posted/uploaded
  //First check for any forums that may have been posted
  Forum.find({ author: req.body.characterName })
    .then((forums) => {
      forumsCreated = forums;
      //Check all forums for any responses the character may have had
      Forum.find({ "threadResponses.author": req.body.characterName })
        .then((response) => {
          responses = response;
          forumsCreated.forEach((forum) => {
            forum.uploadedImages.forEach((picture) => {
              if (!imageNames.includes(picture)) {
                imageNames.push(picture);
              }
            });
          });
          //responses will be all forum objects where the character had responded
          responses.forEach((forumObject) => {
            //go through each forumobject and pull the images they uploaded
            forumObject.threadResponses.forEach((response) => {
              if (response.author === req.body.characterName) {
                response.uploadedImages.forEach((picture) => {
                  if (!imageNames.includes(picture)) {
                    imageNames.push(picture);
                  }
                });
              }
            });
          });
          //return res.json(imageNames);
          //Delete the forums created by the character
          Forum.deleteMany({ author: req.body.characterName })
            .then(() => {
              //Delete any responses the character may have had on any other forum
              Forum.updateMany(
                { "threadResponses.author": req.body.characterName },
                {
                  $pull: {
                    uploadedImages: { $in: imageNames },
                    threadResponses: {
                      author: req.body.characterName,
                    },
                  },
                }
              )
                .then(() => {
                  //Finally delete the character and return the image names stored on all of the forums/responses
                  User.updateOne(
                    { "characters.characterName": req.body.characterName },
                    {
                      $pull: {
                        characters: {
                          characterName: req.body.characterName,
                        },
                      },
                    }
                  )
                    .then(() => {
                      return res.json(imageNames);
                    })
                    .catch((err) => {
                      return res.json("ERR DELETING CHARACTER " + err);
                    });
                })
                .catch((err) => {
                  return res.json("ERR RESPONSES OF FORUMS " + err);
                });
            })
            .catch((err) => {
              return res.json("ERR DELETION OF FORUMS " + err);
            });
          //return res.json(returnValues);
        })
        .catch((err) => {
          return res.json("ERR RESPONSE CHECK: " + err);
        });
    })
    .catch((err) => {
      return res.json("ERR FORUM CHECK: " + err);
    });
});

// @route POST api/administrative/modifyCharacter
// @desc update a users character
// @access Public
router.post("/modifyCharacter", (req, res) => {
  User.updateOne(
    {
      "characters.characterName": req.body.characterName,
    },
    {
      $set: {
        "characters.$.spec": req.body.spec,
        "characters.$.role": req.body.role,
        "characters.$.class": req.body.class,
        "characters.$.isRaider": req.body.isRaider,
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

// @route POST api/administrative/modifyUser
// @desc updates a user
// @access Public
router.post("/modifyUser", (req, res) => {
  const email = req.body.email;
  const username = req.body.username;
  const initialEmail = req.body.initialEmail;
  //check if the email exists already if it were changed AND the password was not changed
  if (req.body.emailChanged && req.body.password === "") {
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
              isAdmin: req.body.isAdmin,
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
  else if (req.body.password !== "") {
    //check if email had been changed
    User.findOne({ email: email }).then((user) => {
      if (user && req.body.emailChanged) {
        return res.json({ detailUpdate: "EAE" });
      } else {
        User.findOne({ username: username }).then((user) => {
          //hash the new password
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
                      isAdmin: req.body.isAdmin,
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
          isAdmin: req.body.isAdmin,
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

// @route POST api/administrative/user
// @desc removes an user from the database
// @access Public
router.post("/deleteUser", async (req, res) => {
  let imageNames = [];
  let characters = req.body.characters;

  //Get all of the images the user may have posted on all characters.
  //For loop to cycle through each character
  //This loop will also delete all characters and remove any forums/responses the characters had
  for (let i = 0; i < characters.length; i++) {
    await getCharactersImages(characters[i]).then(function (images) {
      if (typeof images === "string") {
        return res.json("ERR " + images);
      } else {
        if (images.length > 0) {
          images.forEach((picture) => {
            if (!imageNames.includes(picture)) {
              imageNames.push(picture);
            }
          });
        }
      }
    });
  }

  //Delete the user and then return the imageNames
  User.deleteOne({ username: req.body.username, email: req.body.email })
    .then(() => {
      return res.json(imageNames);
    })
    .catch((err) => {
      return res.json("ERR " + err);
    });
});

async function getCharactersImages(character) {
  let forumsCreated = [];
  let responses = [];
  let imageNames = [];
  //Get all images that the user may have posted/uploaded
  //First check for any forums that may have been posted
  return Forum.find({ author: character.characterName })
    .then(function (forums) {
      forumsCreated = forums;
      //Check all forums for any responses the character may have had
      return Forum.find({ "threadResponses.author": character.characterName })
        .then(function (response) {
          responses = response;
          forumsCreated.forEach((forum) => {
            forum.uploadedImages.forEach((picture) => {
              if (!imageNames.includes(picture)) {
                imageNames.push(picture);
              }
            });
          });
          //responses will be all forum objects where the character had responded
          responses.forEach((forumObject) => {
            //go through each forumobject and pull the images they uploaded
            forumObject.threadResponses.forEach((response) => {
              if (response.author === character.characterName) {
                response.uploadedImages.forEach((picture) => {
                  if (!imageNames.includes(picture)) {
                    imageNames.push(picture);
                  }
                });
              }
            });
          });
          //Delete the forums created by the character
          return Forum.deleteMany({ author: character.characterName })
            .then(function () {
              //Delete any responses the character may have had on any other forum
              return Forum.updateMany(
                { "threadResponses.author": character.characterName },
                {
                  $pull: {
                    uploadedImages: { $in: imageNames },
                    threadResponses: {
                      author: character.characterName,
                    },
                  },
                }
              )
                .then(function () {
                  //Finally delete the character and return the image names stored on all of the forums/responses
                  return User.updateOne(
                    { "characters.characterName": character.characterName },
                    {
                      $pull: {
                        characters: {
                          characterName: character.characterName,
                        },
                      },
                    }
                  )
                    .then(function () {
                      return imageNames;
                    })
                    .catch(function (err) {
                      return "ERR DELETING CHARACTER " + err;
                    });
                })
                .catch(function (err) {
                  return "ERR RESPONSES OF FORUMS " + err;
                });
            })
            .catch(function (err) {
              return "ERR DELETION OF FORUMS " + err;
            });
        })
        .catch(function (err) {
          return "ERR RESPONSE CHECK: " + err;
        });
    })
    .catch(function (err) {
      return "ERR FORUM CHECK: " + err;
    });
}

module.exports = router;
