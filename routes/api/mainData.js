const express = require("express");
const router = express.Router();

const MainData = require("../../models/MainData");

//@route GET api/mainData/getAllMainData
//@desc returns all of the data in the mainData document
//@access public
router.get("/getAllMainData", (req, res) => {
  MainData.find()
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      return res.json("ERR " + err);
    });
});

// @route POST api/mainData/createPost
// @desc creates a new forum
// @access Public
router.post("/createPost", (req, res) => {
  MainData.findOne({ title: req.body.title }).then((post) => {
    if (post) {
      return res.json({ post: "TPAE" });
    } else {
      const newPost = new MainData({
        title: req.body.title,
        author: req.body.author,
        initialText: req.body.initialText,
        uploadedImages: req.body.uploadedImages,
      });

      console.log(newPost);
      newPost
        .save()
        .then((post) => res.json(post))
        .catch((err) => res.json({ post: "CAP" }));
    }
  });
});

module.exports = router;
