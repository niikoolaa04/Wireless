const Command = require("../../structures/Command");
const { MessageEmbed } = require('discord.js');

module.exports = class Snipes extends Command {
  constructor(client) {
    super(client, {
      name: "snipes",
      description: "View last Deleted Message",
      usage: "snipes",
      permissions: [],
      aliases: ["snipe"],
      category: "member",
      listed: true,
      slash: true,
    });
  }

  async run(message, args) {
    if(message.guild.id != this.client.config.developer.server) return;
    let snipe = db.fetch(`snipes_${message.guild.id}`);
    if(!snipe) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "There isn't any Snipes", "RED") ] })

    let embed = new MessageEmbed()
      .setAuthor(snipe.author.username, snipe.author.displayAvatarURL({ dynamic: true }))
      .setDescription(snipe.content)
      .setColor("BLURPLE");

    message.channel.send({ embeds: [embed]});
  }

  async slashRun(interaction, args) {
    let snipe = db.fetch(`snipes_${interaction.guild.id}`);
    if(!snipe) return interaction.followUp({ embeds: [ this.client.embedInteraction(this.client, interaction, "Error", "There isn't any Snipes", "RED") ] })
    
    let embed = new MessageEmbed()
      .setAuthor(snipe.author.username, snipe.author.displayAvatarURL({ dynamic: true }))
      .setDescription(snipe.content)
      .setColor("BLURPLE");

    interaction.followUp({ embeds: [embed] });
  }
};