const mongoose = require("mongoose");
const config = require("../configs/config.json");

const LiveSchema = new mongoose.Schema({
  channel: {
    type: String,
    default: ""
  },
  message: {
    type: String,
    default: ""
  }
});

const GuildSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
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
    type: String,
    default: ""
  },
  blacklistRole: {
    type: String,
    default: ""
  },
  invitesChannel: {
    type: String,
    default: ""
  },
  joinMessage: {
    type: String,
    default: ""
  },
  leaveMessage: {
    type: String,
    default: ""
  },
  dmWinners: {
    type: Boolean,
    default: false
  },
  snipes: {
    type: Boolean,
    default: false
  },
  wlcmImage: {
    type: String,
    default: ""
  },
  welcomeChannel: {
    type: String,
    default: ""
  },
  customEmoji: {
    type: String,
    default: "🎉"
  },
  live: {
    type: LiveSchema
  },
});

module.exports = mongoose.model("Guild", GuildSchema);
