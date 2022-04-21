const Command = require("../../structures/Command");
const Discord = require('discord.js');
const Giveaway = require("../../models/Giveaway.js");

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
    let messageId = args[0];

    if (!messageId || isNaN(messageId)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You haven't entered Message ID.", "RED")] });

    let gwData = await Giveaway.findOne({ messageId, ended: false, guildId: message.guild.id });

    if (!gwData) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You have entered invalid Message ID.", "RED")] });

    this.client.gw.endGiveaway(this.client, message, messageId, message.guild);
    message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Giveaway", `Giveaway have been ended successfuly.`, "YELLOW")] });
  }
  async slashRun(interaction, args) {
    let messageId = parseInt(interaction.options.getString("msgid")) || 0;

    let gwData = await Giveaway.findOne({ messageId, ended: false, guildId: interaction.guild.id });

    if (!gwData) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Error", "You have entered invalid Message ID.", "RED")], ephemeral: true });

    this.client.gw.endGiveaway(this.client, interaction, messageId, interaction.guild);
    interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Giveaway", `Giveaway have been ended successfuly.`, "YELLOW")] });
  }
};
