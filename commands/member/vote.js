const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class Vote extends Command {
  constructor(client) {
    super(client, {
      name: "vote",
      description: "vote for bot",
      usage: "vote",
      permissions: [],
      aliases: ["upvote"],
      category: "member",
      listed: true,
    });
  }

  async run(message, args) {
    let embed = new Discord.MessageEmbed()
      .setDescription(`Vote for me by [Clicking Here](${this.client.config.links.voteURL})`)
      .setColor("BLURPLE");
    message.channel.send({ embeds: [embed] });
  }
};