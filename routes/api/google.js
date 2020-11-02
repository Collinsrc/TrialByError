const express = require("express");
const router = express.Router();
const axios = require("axios").default;

const auth = require("../../config/google");

// // @route GET api/user/getUserInfo/:username
// // @desc get information about a specific user
// // @access Public
// router.get("/getRaiders", (req, res) => {
//   User.find().then((users) => {
//     if (users) {
//       raiders = new Array();
//       users.forEach(function (user) {
//         user.characters.map((character) => {
//           if (character.isRaider) {
//             raiders.push(character);
//           }
//         });
//       });
//       return res.json(raiders);
//     } else {
//       return res.status(400).json("No Raiders Found");
//     }
//   });
// });

// @route POST api/google/validateRecaptchaV2
// @desc validate a recaptcha v2 token with google
router.post("/validateRecaptchaV2", async (req, res) => {
  let token = req.body.token;
  await axios
    .post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${auth.secretKey}&response=${token}`
    )
    .then((ret) => {
      return res.json(ret.data);
    });
});

module.exports = router;
