const express = require("express");
const router = express.Router();

const User = require("../../models/User");

// @route GET api/user/getUserInfo/:username
// @desc get information about a specific user
// @access Public
router.get("/getRaiders", (req, res) => {
  User.find().then((users) => {
    if (users) {
      raiders = new Array();
      users.forEach(function (user) {
        user.characters.map((character) => {
          if (character.isRaider) {
            raiders.push(character);
          }
        });
      });
      return res.json(raiders);
    } else {
      return res.status(400).json("No Raiders Found");
    }
  });
});

module.exports = router;
