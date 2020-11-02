const express = require("express");
const router = express.Router();
const axios = require("axios").default;

const auth = require("../../config/blizzardAuth");
const {
  ClientCredentials,
  ResourceOwnerPassword,
  AuthorizationCode,
} = require("simple-oauth2");
const { json } = require("body-parser");

const oauth2 = new ClientCredentials({
  client: {
    id: auth.clientID,
    secret: auth.clientSecret,
  },
  auth: {
    tokenHost: "https://us.battle.net/oauth/token",
  },
});

router.get("/getCharacter", (req, res) => {
  let charName = "sephiroth";
  let oauthToken = oauth2.getToken().then((token) => {
    axios
      .get(
        `https://us.api.blizzard.com/profile/wow/character/area-52/${charName}/equipment?namespace=profile-us&locale=en_US`,
        {
          headers: {
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            authorization: `Bearer ${token.token.access_token}`,
          },
        }
      )
      .then((ret) => {
        return res.json(ret.data);
      });
  });
});

router.get("/getCharacterAppearance", (req, res) => {
  let charName = "sephiroth";
  let oauthToken = oauth2.getToken().then((token) => {
    axios
      .get(
        `https://us.api.blizzard.com/profile/wow/character/area-52/sephiroth/appearance?namespace=profile-us&locale=en_US`,
        {
          headers: {
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            authorization: `Bearer ${token.token.access_token}`,
          },
        }
      )
      .then((ret) => {
        return res.json(ret.data);
      });
  });
});

router.get("/getCharacterBust/:characterName", (req, res) => {
  let charName = req.params.characterName;
  oauth2.getToken().then((token) => {
    axios
      .get(
        `https://us.api.blizzard.com/profile/wow/character/area-52/${charName}/character-media?namespace=profile-us&locale=en_US`,
        {
          headers: {
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            authorization: `Bearer ${token.token.access_token}`,
          },
        }
      )
      .then((ret) => {
        return res.json(ret.data);
      })
      .catch((err) => {
        return res.json("CBNF");
      });
  });
});

router.get("/verifyCharacterExists/:characterName", (req, res) => {
  let charName = req.params.characterName;
  oauth2.getToken().then((token) => {
    axios
      .get(
        `https://us.api.blizzard.com/profile/wow/character/area-52/${charName}?namespace=profile-us&locale=en_US`,
        {
          headers: {
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            authorization: `Bearer ${token.token.access_token}`,
          },
        }
      )
      .then((ret) => {
        return res.json(true);
      })
      .catch((err) => {
        return res.json("CDNE");
      });
  });
});

module.exports = router;
