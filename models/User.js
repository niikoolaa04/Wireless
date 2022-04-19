const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: {
    type: String
  },
  guild: {
    type: String,
  },
  invites: {
    type: Number,
    default: 0
  },
  messages: {
    type: Number,
    default: 0
  },
  inviter: {
    type: String,
    default: null
  },
  invitesHistory: {
    type: Array,
    default: []
  },
  invitesRegular: {
    type: Number,
    default: 0
  },
  invitesJoins: {
    type: Number,
    default: 0
  },
  invitesLeaves: {
    type: Number,
    default: 0
  },
  invitesBonus: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("User", UserSchema);
