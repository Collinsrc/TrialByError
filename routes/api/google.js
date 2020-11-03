const express = require("express");
const router = express.Router();
const axios = require("axios").default;

require("dotenv").config();

// @route POST api/google/validateRecaptchaV2
// @desc validate a recaptcha v2 token with google
router.post("/validateRecaptchaV2", async (req, res) => {
  let token = req.body.token;
  await axios
    .post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`
    )
    .then((ret) => {
      return res.json(ret.data);
    });
});

module.exports = router;
