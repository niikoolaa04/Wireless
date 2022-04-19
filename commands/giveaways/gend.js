const Command = require("../../structures/Command");
const Discord = require('discord.js');
const db = require("quick.db");

module.exports = class GiveawayEdit extends Command {
  constructor(client) {
    super(client, {
      name: "gend",
      description: "End giveaway",
      usage: "gend [Message ID]",
      permissions: ["ADMINISTRATOR"],
      aliases: ["gwend"],
      category: "giveaway",
      listed: true,
      slash: true,
      options: [{
        name: 'msgid',
        type: 'STRING',
        description: 'Message ID of Giveaway',
        required: true,
      }],
    });
  }

  async run(message, args) {
    let messageID = args[0];

    if (!messageID || isNaN(messageID)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You haven't entered Message ID.", "RED")] });

    let gwData = await Giveaway.findOne({ messageID, ended: false, guildID: message.guild.id });

    if (!gwData) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You have entered invalid Message ID.", "RED")] });

    this.client.gw.endGiveaway(this.client, message, messageID, message.guild);
    message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Giveaway", `Giveaway have been ended successfuly.`, "YELLOW")] });
  }
  async slashRun(interaction, args) {
    let messageID = parseInt(interaction.options.getString("msgid")) || 0;

    let gwData = await Giveaway.findOne({ messageID, ended: false, guildID: interaction.guild.id });

    if (!gwData) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Error", "You have entered invalid Message ID.", "RED")], ephemeral: true });

    this.client.gw.endGiveaway(this.client, interaction, messageID, interaction.guild);
    interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Giveaway", `Giveaway have been ended successfuly.`, "YELLOW")] });
  }
};
