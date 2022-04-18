const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = class Premium extends Command {
  constructor(client) {
    super(client, {
      name: "premium",
      description: "Informations about Premium",
      usage: "premium",
      permissions: [],
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
					.setLabel('Join Support Server')
					.setStyle('LINK'),
			).addComponents(
				new MessageButton()
          .setURL(this.client.config.links.patreon)
					.setLabel('Patreon')
					.setStyle('LINK'),
			);

    let embed = new MessageEmbed()
      .setDescription(`To purchase **Premium** you need to be in our Support Server and then purchase Tier from Patreon.
If you aren't in our Support Server your cannot receive **Premium Key**, if you leave Server all Guilds which recieved **Premium** from you will lose it.`)
      .setColor("BLURPLE");
    message.channel.send({ embeds: [embed], components: [row] });
  }

  async slashRun(interaction, args) {
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
          .setURL(this.client.config.links.supportServer)
					.setLabel('Join Support Server')
					.setStyle('LINK'),
			).addComponents(
				new MessageButton()
          .setURL(this.client.config.links.patreon)
					.setLabel('Patreon')
					.setStyle('LINK'),
			);

    let embed = new MessageEmbed()
      .setDescription(`To purchase **Premium** you need to be in our Support Server and then purchase Tier from Patreon.
If you aren't in our Support Server your cannot receive **Premium Key**, if you leave Server all Guilds which recieved **Premium** from you will lose it.`)
      .setColor("BLURPLE");
    interaction.reply({ embeds: [embed], components: [row] });
  }
};
