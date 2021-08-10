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
    let snipe = this.client.snipes.get(message.guild.id);
    if(!snipe) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "There are no Snipes", "RED") ] })

    let user = this.client.users.cache.get(snipe.author.id);
    if(user) let av = user.displayAvatarURL({ dynamic: true });

    let embed = new MessageEmbed()
      .setAuthor(snipe.author.username, user ? av : 'https://cdn.discordapp.com/embed/avatars/0.png')
      .setDescription(snipe.content)
      .setColor("BLURPLE");

    message.channel.send({ embeds: [embed]});
  }

  async slashRun(interaction, args) {
    let snipe = this.client.snipes.get(message.guild.id);
    if(!snipe) return interaction.followUp({ embeds: [ this.client.embedInteraction(this.client, interaction, "Error", "There are no Snipes", "RED") ] })
    
    let user = this.client.users.cache.get(snipe.author.id);
    if(user) let av = user.displayAvatarURL({ dynamic: true });

    let embed = new MessageEmbed()
      .setAuthor(snipe.author.username, user ? av : 'https://cdn.discordapp.com/embed/avatars/0.png')
      .setDescription(snipe.content)
      .setColor("BLURPLE");

    interaction.followUp({ embeds: [embed] });
  }
};