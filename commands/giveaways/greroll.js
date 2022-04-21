const Command = require("../../structures/Command");
const Discord = require('discord.js');
const Giveaway = require("../../models/Giveaway.js");

module.exports = class GiveawayReroll extends Command {
  constructor(client) {
    super(client, {
      name: "greroll",
      description: "Reroll giveaway winners",
      usage: "greroll [Message ID]",
      permissions: ["ADMINISTRATOR"],
      aliases: ["gwreroll"], 
      category: "giveaway",
      listed: true,
      slash: true,
      options: [{
        name: 'msgid',
        type: 'STRING',
        description: 'Message ID of Giveaway',
        required: true,
      }]
    });
  }

  async run(message, args) {
    let messageId = args[0];

    if (!messageId || isNaN(messageId)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You haven't entered Message ID.", "RED")] });

    let gwData = await Giveaway.findOne({ messageId, ended: true, guildId: message.guild.id });

    if (!gwData) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You have entered invalid Message ID or that Giveaway haven't ended.", "RED")] });

    this.client.gw.rerollGiveaway(this.client, message, messageId);
  }
  async slashRun(interaction, args) {
    let messageId = parseInt(interaction.options.getString("msgid")) || 0;

    let gwData = await Giveaway.findOne({ messageId, ended: true, guildId: interaction.guild.id });

    if (!gwData) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Error", "You have entered invalid Message ID or that Giveaway haven't ended.", "RED")], ephemeral: true });

    this.client.gw.rerollGiveaway(this.client, interaction, messageId);
    interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Giveaway", `Giveaway have been rerolled successfuly.`, "YELLOW")] });
  }
};
