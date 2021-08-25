const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class TopInvites extends Command {
  constructor(client) {
    super(client, {
      name: "topinvites",
      description: "Top 10 users by invites",
      usage: "topinvites",
      permissions: [],
      category: "member",
      listed: true,
      slash: true,
    });
  }

  async run(message, args) {
    let content = this.client.utils.lbContent(this.client, message, "invitesRegular");

    let embed = new Discord.MessageEmbed()
      .setDescription(content)
      .setTitle("🎫・Top Invites")
      .setDescription(`\`Top 10 Users by Invites.\`

${content}`)
      .setColor("BLURPLE");

    message.channel.send({ embeds: [embed] });
  }
  async slashRun(interaction, args) {
    let content = this.client.utils.lbContent(this.client, interaction, "invitesRegular");

    let embed = new Discord.MessageEmbed()
      .setDescription(content)
      .setTitle("🎫・Top Invites")
      .setDescription(`\`Top 10 Users by Invites.\`

${content}`)
      .setColor("BLURPLE");

    interaction.followUp({ embeds: [embed] });
  }
};