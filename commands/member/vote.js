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
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('voteBot')
          .setURL("https://top.gg/bot/855321650706513940/vote/")
					.setLabel('Vote for me')
					.setStyle('LINK'),
			);

    let embed = new Discord.MessageEmbed()
      .setDescription(`Vote for me by clicking on Button.`)
      .setColor("BLURPLE");
    message.channel.send({ embeds: [embed], components: [row] });
  }
};