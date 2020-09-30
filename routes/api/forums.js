const express = require("express");
const router = express.Router();

const Forum = require("../../models/Forum");

// @route POST api/forums/createForum
// @desc creates a new forum
// @access Public
router.post("/createForum", (req, res) => {
  Forum.findOne({ title: req.body.title }).then((forum) => {
    if (forum) {
      return res.json({ forum: "Title of forum already exists" });
    } else {
      const newForum = new Forum({
        title: req.body.title,
        category: req.body.category,
        author: req.body.author,
        initialText: req.body.initialText,
        uploadedImages: req.body.uploadedImages,
        authorUsername: req.body.authorUsername,
      });

      newForum
        .save()
        .then((forum) => res.json(forum))
        .catch((err) =>
          res.json({ forum: "Couldn't add forum into database" })
        );
      //
    }
  });
});

// @route GET api/forums/getForums
// @desc gets all forums WITHOUT responses
// @access Public
router.get("/getForums", (req, res) => {
  Forum.aggregate([
    {
      $project: {
        title: 1,
        category: 1,
        author: 1,
        dateString: {
          $dateToString: { date: "$dateCreated", format: "%m-%d-%Y" },
        },
        replies: { $size: "$threadResponses" },
        dateCreated: 1,
        authorUsername: 1,
      },
    },
    { $sort: { dateCreated: -1 } },
  ])
    .then((forums) => {
      if (forums) {
        return res.json(forums);
      } else {
        return res.json("NA");
      }
    })
    .catch((err) => {
      return res.json("ERR " + err);
    });
});

// @route GET api/forums/getForum/:forumTitle
// @desc gets a specified forum with all responses
// @access Public
router.get("/getForum/:forumTitle", (req, res) => {
  Forum.findOne({ title: req.params.forumTitle })
    .then((forum) => {
      if (forum) {
        return res.json(forum);
      } else {
        return res.json("NA");
      }
    })
    .catch((err) => {
      return res.json("ERR " + err);
    });
});

// @route POST api/forums/addResponse/
// @desc adds a response to threadResponses array of forum
// @access Public
router.post("/addResponse", (req, res) => {
  Forum.updateOne(
    { title: req.body.title },
    {
      $push: {
        threadResponses: {
          author: req.body.author,
          responseText: req.body.responseText,
          uploadedImages: req.body.uploadedImages,
          authorUsername: req.body.authorUsername,
        },
        uploadedImages: req.body.uploadedImages,
      },
    }
  )
    .then(() => {
      return res.json("Successfully updated database");
    })
    .catch((err) => {
      return res.json("ERR " + err);
    });
});

// @route POST api/forums/deleteResponse/
// @desc removes a response from the threadResponses array of forum
// @access Public
router.post("/deleteResponse", (req, res) => {
  Forum.updateOne(
    { title: req.body.title },
    {
      $pull: {
        threadResponses: {
          author: req.body.author,
          responseText: req.body.responseText,
          uploadedImages: req.body.uploadedImages,
          authorUsername: req.body.authorUsername,
        },
        uploadedImages: { $in: req.body.uploadedImages },
      },
    }
  )
    .then(() => {
      return res.json("Successfully deleted response");
    })
    .catch((err) => {
      return res.json("ERR " + err);
    });
});

// @route POST api/forums/deleteForum/
// @desc removes a forum
// @access Public
router.post("/deleteForum", (req, res) => {
  Forum.deleteOne({ title: req.body.title }).catch((err) => {
    return res.json("ERR " + err);
  });
});

//@route GET api/forums/getAllForumData
//@desc returns all of the data in the forums document
//@access public
router.get("/getAllForumData", (req, res) => {
  Forum.find()
    .then((data) => {
      return res.json(data);
    })
    .catch((err) => {
      return res.json("ERR " + err);
    });
});

module.exports = router;
