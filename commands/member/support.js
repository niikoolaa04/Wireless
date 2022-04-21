const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = class Support extends Command {
  constructor(client) {
    super(client, {
      name: "support",
      description: "Support Server Link",
      usage: "support",
      permissions: [],
      aliases: ["supportserver"],
      category: "member",
      listed: true,
      slash: true,
    });
  }

  async run(message, args) {
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
          .setURL(this.client.config.links.supportServer)
					.setLabel('Support Server')
					.setStyle('LINK'),
        new MessageButton()
          .setURL(this.client.config.links.inviteSite)
					.setLabel('Vote')
					.setStyle('LINK'),
        new MessageButton()
          .setURL(this.client.config.links.website)
					.setLabel('Website')
					.setStyle('LINK'),
			);

    let embed = new MessageEmbed()
      .setDescription(`> If you need help with bot or have a question, use button to Join Support Server.`)
      .setColor("BLURPLE");
    message.channel.send({ embeds: [embed], components: [row] });
  }

  async slashRun(interaction, args) {
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
          .setURL(this.client.config.links.supportServer)
					.setLabel('Support Server')
					.setStyle('LINK'),
        new MessageButton()
          .setURL(this.client.config.links.inviteSite)
					.setLabel('Vote')
					.setStyle('LINK'),
				new MessageButton()
          .setURL(this.client.config.links.website)
					.setLabel('Website')
					.setStyle('LINK'),
			);

    let embed = new MessageEmbed()
      .setDescription(`> If you need help with bot or have a question, use button to Join Support Server.`)
      .setColor("BLURPLE");
    interaction.reply({ embeds: [embed], components: [row] });
  }
};
