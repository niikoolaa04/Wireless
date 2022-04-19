const mongoose = require("mongoose");

const KeySchema = new mongoose.Schema({
  data: {
    type: String,
  },
  guild: {
    type: String,
  },
  used: {
    type: Boolean,
    default: false
  },
  user: {
    type: String
  }
});

module.exports = mongoose.model("Key", KeySchema);
