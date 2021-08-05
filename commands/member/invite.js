const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class Invite extends Command {
  constructor(client) {
    super(client, {
      name: "invite",
      description: "invite bot to your server",
      usage: "invite",
      permissions: [],
      aliases: ["link"],
      category: "utility",
      listed: true,
    });
  }

  async run(message, args) {
    let embed = new Discord.MessageEmbed()
      .setDescription(`Invite Me to your Server by [Clicking Here](${this.client.config.links.inviteURL})`)
      .setColor("BLURPLE");
    message.channel.send({ embeds: [embed] });
  }
};