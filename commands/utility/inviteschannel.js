const Command = require("../../structures/Command");
const Discord = require("discord.js");
const db = require("quick.db");

module.exports = class InvitesChannel extends Command {
  constructor(client) {
    super(client, {
      name: "inviteschannel",
      description: "channel to log invites on join/leave",
      usage: "inviteschannel [#Channel]",
      permissions: ["ADMINISTRATOR"],
      category: "utility",
      listed: true,
    });
  }

  async run(message, args) {
    let channel = message.mentions.channels.first();
    if (!channel) {
      db.delete(`channel_${message.guild.id}_invites`);
      let msgEmbedClear = new Discord.MessageEmbed()
        .setDescription(`Invites Channel have been reseted.`)
        .setColor("BLURPLE");
      message.channel.send({ embeds: [msgEmbedClear] });
    }
    if (channel) {
      db.set(`channel_${message.guild.id}_invites`, channel.id);
      let msgEmbed = new Discord.MessageEmbed()
        .setAuthor("Invites Channel", this.client.user.displayAvatarURL())
        .setDescription(`Invites Channel has been set to ${channel}.
To reset it just use command without arguments.`)
        .setColor("BLURPLE");
      message.channel.send({ embeds: [msgEmbed] });
    }
  }
};