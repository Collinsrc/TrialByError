const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GuildInformationSchema = new Schema({
  mainPageGuildDescription: {
    type: String,
    trim: true,
  },
  mainPageSecondaryGuildDescription: {
    type: String,
    trim: true,
  },
  tankRecruitment: {
    type: String,
    trim: true,
  },
  healerRecruitment: {
    type: String,
    trim: true,
  },
  dpsRecruitment: {
    type: String,
    trim: true,
  },
  raidTimes: {
    type: String,
    trim: true,
  },
  raidRules: {
    type: String,
    trim: true,
  },
  raidExpectations: {
    type: String,
    trim: true,
  },
});

module.exports = GuildInformation = mongoose.model(
  "guildinformations",
  GuildInformationSchema
);
