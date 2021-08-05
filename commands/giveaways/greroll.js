const Command = require("../../structures/Command");
const Discord = require('discord.js');
const ms = require('ms');
const db = require("quick.db");

module.exports = class GiveawayReroll extends Command {
  constructor(client) {
    super(client, {
      name: "greroll",
      description: "reroll giveaway winners",
      usage: "greroll [Message ID]",
      permissions: ["ADMINISTRATOR"],
      aliases: ["gwreroll"], 
      category: "giveaway",
      listed: true,
    });
  }

  async run(message, args) {
    let messageID = args[0];

    if (!messageID || isNaN(messageID)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You haven't entered Message ID.", "RED")] });

    let giveaways = db.fetch(`giveaways_${message.guild.id}`);
    let gwData = giveaways.find(g => g.messageID == messageID && g.ended == true);

    if (!gwData) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Message ID or that Giveaway haven't ended.", "RED")] });

    this.client.gw.rerollGiveaway(this.client, message, messageID);
  }
};