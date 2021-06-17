const Command = require("../../structures/Command");
const Discord = require('discord.js');
const db = require("quick.db");

module.exports = class GiveawayEdit extends Command {
  constructor(client) {
    super(client, {
      name: "gend",
      description: "end giveaway",
      usage: "gend [Message ID]",
      permissions: ["ADMINISTRATOR"],
      aliases: ["gwend"],
      category: "giveaway",
      listed: true,
    });
  }

  async run(message, args) {
    let messageID = args[0];

    if (!messageID || isNaN(messageID)) return message.channel.send(this.client.embedBuilder(this.client, message, "Greška", "You haven't entered Message ID.", "RED"));

    let giveaways = db.fetch(`giveaways_${message.guild.id}`);
    let gwData = giveaways.find(g => g.messageID == messageID && g.ended == false);

    if (!gwData) return message.channel.send(this.client.embedBuilder(this.client, message, "Greška", "You have entered invalid Message ID.", "RED"));

    this.client.gw.endGiveaway(this.client, message, messageID, message.guild);
    message.channel.send(this.client.embedBuilder(this.client, message, "Giveaway", `Giveaway have been ended successfuly.`, "YELLOW"));
  }
};