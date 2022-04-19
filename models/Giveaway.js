const mongoose = require("mongoose");
const config = require("../../configs/config.json");

const ReqSchema = new mongoose.Schema({
  messagesReq: Number,
  invitesReq: Number,
  roleReq: String
});

const GiveawaysSchema = new mongoose.Schema({
  messageID: {
    type: String
  },
  guildID: {
    type: String,
  },
  channelID: {
    type: String,
  },
  prize: {
    type: String,
  },
  duration: {
    type: String,
  },
  hostedBy: {
    type: String,
  },
  winnerCount: {
    type: String,
  },
  requirements: {
    type: ReqSchema
  },
  roleBypass: {
    type: String,
  },
  ended: {
    type: Boolean,
  },
  endsAt: {
    type: String,
  },
  winners: {
    type: Array,
  },
  /*
  
  messageID: messageID,
    guildID: guild,
    channelID: channel,
    prize: prize,
    duration: time,
    hostedBy: hoster,
    winnerCount: winners,
    requirements: {
      messagesReq: messages,
      invitesReq: invites,
      roleReq: role,
    },
    roleBypass,
    ended: false,
    endsAt: ending,
    winners: []
  */
});

module.exports = mongoose.model("Giveaways", GiveawaysSchema);
