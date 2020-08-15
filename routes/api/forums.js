const express = require("express");
const router = express.Router();

const Forum = require("../../models/Forum");

// @route POST api/forums/createForum
// @desc creates a new forum
// @access Public
router.post("/createForum", (req, res) => {
  Forum.findOne({ title: req.body.title }).then((forum) => {
    if (forum) {
      return res.json("Title of forum already exists");
    } else {
      const newForum = new Forum({
        title: req.body.title,
        category: req.body.category,
        author: req.body.author,
        initalText: req.body.initalText,
      });

      newForum
        .save()
        .then((forum) => res.json(forum))
        .catch(() => res.json("Couldn't add forum into database"));
    }
  });
});

module.exports = router;
