const express = require("express");
const router = express.Router();

const MainData = require("../../models/MainData");

//@route GET api/mainData/getAllMainData
//@desc returns all of the data in the mainData document
//@access public
router.get("/getAllMainData", (req, res) => {
  MainData.aggregate([
    {
      $project: {
        title: 1,
        author: 1,
        dateString: {
          $dateToString: { date: "$dateCreated", format: "%m-%d-%Y" },
        },
        dateCreated: 1,
        uploadedImages: 1,
        initialText: 1,
      },
    },
    { $sort: { dateCreated: -1 } },
  ])
    .then((data) => {
      if (data) {
        return res.json(data);
      } else {
        return res.json("NA");
      }
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

      newPost
        .save()
        .then((post) => res.json(post))
        .catch((err) => res.json({ post: "CAP" }));
    }
  });
});

// @route POST api/mainData/deletePost/
// @desc removes a forum
// @access Public
router.post("/deletePost", (req, res) => {
  MainData.deleteOne({ title: req.body.title }).catch((err) => {
    return res.json("ERR " + err);
  });
});

module.exports = router;
