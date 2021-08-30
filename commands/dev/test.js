const Command = require("../../structures/Command");
const Discord = require('discord.js');
const db = require("quick.db");

module.exports = class Test extends Command {
  constructor(client) {
    super(client, {
      name: "test",
      description: "Command for Testing",
      usage: "test",
      permissions: [],
      category: "dev",
      listed: false,
    });
  }

  async run(message, args) {
    var allowedToUse = false;
    this.client.dev_ids.forEach(id => {
      if (message.author.id == id) allowedToUse = true;
    });
    if (!allowedToUse) return;
  }
};