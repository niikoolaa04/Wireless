const mongoose = require("mongoose");
const config = require("../configs/config.json");

const GuildSchema = new mongoose.Schema({
  id: {
    type: String
  },
  prefix: {
    type: String,
    default: config.prefix
  },
  premium: {
    type: Boolean,
    default: false
  },
  bypassRole: {
    type: String
  },
  blacklistRole: {
    type: String
  },
  invitesChannel: {
    type: String
  },
  joinMessage: {
    type: String
  },
  leaveMessage: {
    type: String
  },
  dmWinners: {
    type: Boolean
  },
  snipes: {
    type: Boolean
  },
  wlcmImage: {
    type: String
  },
  welcomeChannel: {
    type: String
  },
  customEmoji: {
    type: String
  },
});

module.exports = mongoose.model("Guild", GuildSchema);
