const Command = require("../../structures/Command");
const { MessageEmbed } = require('discord.js');

module.exports = class Snipe extends Command {
  constructor(client) {
    super(client, {
      name: "snipe",
      description: "View last Deleted Message",
      usage: "snipe",
      permissions: [],
      aliases: ["snipes"],
      category: "member",
      listed: true,
      slash: true,
    });
  }

  async run(message, args) {
    let snipe = this.client.snipes.get(message.guild.id);
    if(!snipe) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "There are no Snipes", "RED") ] })

    let user = this.client.users.cache.get(snipe.author.id);
    let av = 'https://cdn.discordapp.com/embed/avatars/0.png';
    if(user) av = user.displayAvatarURL({ dynamic: true });

    let embed = new MessageEmbed()
      .setAuthor(snipe.author.username, av)
      .setDescription(snipe.content)
      .setTimestamp(snipe.time)
      .setFooter("Message Deleted at", this.client.user.displayAvatarURL())
      .setColor("BLURPLE");

    message.channel.send({ embeds: [embed]});
  }

  async slashRun(interaction, args) {
    let snipe = this.client.snipes.get(message.guild.id);
    if(!snipe) return interaction.followUp({ embeds: [ this.client.embedInteraction(this.client, interaction, "Error", "There are no Snipes", "RED") ] })
    
    let user = this.client.users.cache.get(snipe.author.id);
    let av = 'https://cdn.discordapp.com/embed/avatars/0.png';
    if(user) av = user.displayAvatarURL({ dynamic: true });

    let embed = new MessageEmbed()
      .setAuthor(snipe.author.username, av)
      .setDescription(snipe.content)
      .setTimestamp(snipe.time)
      .setFooter("Message Deleted at", this.client.user.displayAvatarURL())
      .setColor("BLURPLE");

    interaction.followUp({ embeds: [embed] });
  }
};