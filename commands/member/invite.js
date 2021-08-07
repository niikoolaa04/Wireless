const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = class Invite extends Command {
  constructor(client) {
    super(client, {
      name: "invite",
      description: "invite bot to your server",
      usage: "invite",
      permissions: [],
      aliases: ["link"],
      category: "member",
      listed: true,
    });
  }

  async run(message, args) {
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('inviteBot')
          .setURL("https://invites.wireless-bot.tech")
					.setLabel('Invite Me')
					.setStyle('LINK'),
			);

    let embed = new MessageEmbed()
      .setDescription(`Invite Me to your Server by clicking on Button.`)
      .setColor("BLURPLE");
    message.channel.send({ embeds: [embed], components: [row] });
  }
};