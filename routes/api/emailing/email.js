const express = require("express");
const router = express.Router();

const User = require("../../../models/User");
const TempUser = require("../../../models/TempUser");
const ObjectID = require("mongodb").ObjectID;

// @route POST api/email/confirmEmail/
// @desc confirms a users email
// @access Public
router.post("/confirmEmail", (req, res) => {
  let response = {
    emailConfirmed: false,
    message: "",
  };
  TempUser.findById(req.body.tempUserID).then((tempUser) => {
    if (!tempUser) {
      response.message =
        "Could not verify email. Please try to apply again. The email verification only lasts 10 minutes!";
      return res.json(response);
    } else {
      const newUser = new User({
        username: tempUser.username,
        email: tempUser.email,
        password: tempUser.password,
        characters: tempUser.characters,
        experience: tempUser.experience,
        about: tempUser.about,
        realID: tempUser.realID,
        confirmed: true,
      });
      let id = req.body.tempUserID;
      TempUser.deleteOne({ _id: ObjectID(id) })
        .then(() => {
          newUser
            .save()
            .then(() => {
              response.emailConfirmed = true;
              response.message =
                "Successfully verified email! You can now log in!";
              return res.json(response);
            })
            .catch((err) => console.log("Couln't create user " + err));
        })
        .catch((err) => {
          console.log("Couldn't delete temp user " + err);
        });
    }
  });
});

module.exports = router;
