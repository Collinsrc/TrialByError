const express = require("express");
const router = express.Router();

const GuildInformation = require("../../models/GuildInformation");

// @route GET api/guildInformation/getGuildInformation
// @desc get the guild information
// @access Public
router.get("/getGuildInformation", (req, res) => {
  GuildInformation.findOne().then((guildInformation) => {
    if (guildInformation) {
      return res.json(guildInformation);
    } else {
      return res.status(400).json("No Guild Information Found");
    }
  });
});

module.exports = router;
