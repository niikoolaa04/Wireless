const mongoose = require("mongoose");

const BotSchema = new mongoose.Schema({
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
