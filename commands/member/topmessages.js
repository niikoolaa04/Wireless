const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class TopMessages extends Command {
  constructor(client) {
    super(client, {
      name: "topmessages",
      description: "Top 10 users by messages",
      usage: "topmessages",
      permissions: [],
      category: "member",
      listed: true,
      slash: true,
    });
  }

  async run(message, args) {
    let content = await this.client.utils.lbContent(this.client, message, "messages");

    let embed = new Discord.MessageEmbed()
      .setDescription(content)
      .setTitle("💬・Top Messages")
      .setDescription(`\`Top 10 Users by sent Messages.\`

${content}`)
      .setColor("BLURPLE");

    message.channel.send({ embeds: [embed] });
  }
  async slashRun(interaction, args) {
    let content = await this.client.utils.lbContent(this.client, interaction, "messages");

    let embed = new Discord.MessageEmbed()
      .setDescription(content)
      .setTitle("💬・Top Messages")
      .setDescription(`\`Top 10 Users by sent Messages.\`

${content}`)
      .setColor("BLURPLE");

    interaction.reply({ embeds: [embed] });
  }
};
