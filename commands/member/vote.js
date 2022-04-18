const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = class Vote extends Command {
  constructor(client) {
    super(client, {
      name: "vote",
      description: "Vote for bot",
      usage: "vote",
      permissions: [],
      aliases: ["upvote"],
      category: "member",
      listed: true,
      slash: true,
    });
  }

  async run(message, args) {
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
          .setURL(this.client.config.links.voteURL)
					.setLabel('Vote for me')
					.setStyle('LINK'),
			);

    let embed = new MessageEmbed()
      .setDescription(`Vote for me by clicking on Button.`)
      .setColor("BLURPLE");
    message.channel.send({ embeds: [embed], components: [row] });
  }

  async slashRun(interaction, args) {
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
          .setURL(this.client.config.links.voteURL)
					.setLabel('Vote for me')
					.setStyle('LINK'),
			);

    let embed = new MessageEmbed()
      .setDescription(`Vote for me by clicking on Button.`)
      .setColor("BLURPLE");
    interaction.reply({ embeds: [embed], components: [row] });
  }
};
