const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = class Invite extends Command {
  constructor(client) {
    super(client, {
      name: "invite",
      description: "Invite bot to your server",
      usage: "invite",
      permissions: [],
      aliases: ["link"],
      category: "member",
      listed: true,
      slash: true,
    });
  }

  async run(message, args) {
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
          .setURL(this.client.config.links.inviteURL)
					.setLabel('Invite Me')
					.setStyle('LINK'),
			);

    let embed = new MessageEmbed()
      .setDescription(`> If you want to Invite Bot to your Server use button below.`)
      .setColor("BLURPLE");
    message.channel.send({ embeds: [embed], components: [row] });
  }

  async slashRun(interaction, args) {
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
          .setURL(this.client.config.links.inviteURL)
					.setLabel('Invite Me')
					.setStyle('LINK'),
			);

    let embed = new MessageEmbed()
      .setDescription(`> If you want to Invite Bot to your Server use button below.`)
      .setColor("BLURPLE");
    interaction.reply({ embeds: [embed], components: [row] });
  }
};
