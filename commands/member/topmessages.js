const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class TopMessages extends Command {
  constructor(client) {
    super(client, {
      name: "topmessages",
      description: "top 10 users by messages",
      usage: "topmessages",
      permissions: [],
      category: "member",
      listed: true,
    });
  }

  async run(message, args) {
    let content = this.client.utils.lbContent(this.client, message, "messages");

    let embed = new Discord.MessageEmbed()
      .setDescription(content)
      .setTitle("💬︲Top Messages")
      .setDescription(`\`Top 10 Users by sent Messages.\`

${content}`)
      .setColor("BLURPLE");

    message.channel.send(embed);
  }
};