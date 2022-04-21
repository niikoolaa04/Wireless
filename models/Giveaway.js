const mongoose = require("mongoose");

const ReqSchema = new mongoose.Schema({
  messagesReq: Number,
  invitesReq: Number,
  roleReq: String
});

const GiveawaysSchema = new mongoose.Schema({
  messageId: {
    type: String
  },
  guildId: {
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
    type: Number,
  },
  requirements: ReqSchema,
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
});

module.exports = mongoose.model("Giveaways", GiveawaysSchema);
