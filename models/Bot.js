const mongoose = require("mongoose");

const BotSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "wireless"
  },
  guildBlacklist: {
    type: Array,
    default: []
  },
  premiumKeys: {
    type: Array,
    default: []
  },
  userBlacklist: {
    type: Array,
    default: []
  },
});

module.exports = mongoose.model("Bot", BotSchema);
