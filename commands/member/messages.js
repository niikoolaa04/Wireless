const Command = require("../../structures/Command");
const Discord = require("discord.js");
const db = require("quick.db");

module.exports = class Messages extends Command {
	constructor(client) {
		super(client, {
			name: "messages",
			description: "Number of sent messages",
			usage: "messages [@User]",
			permissions: [],
			category: "member",
			listed: true,
      slash: true,
      options: [{
        name: 'target',
        type: 'USER',
        description: "User which Messages to view",
        required: false,
      }]
		});
	}

  async run(message, args) {
    var user = message.mentions.users.first() || this.client.users.cache.get(args[0]) || message.author;
  
    let messages;
    await Guild.findOne({ id: message.guild.id }, (err, result) => {
      if (result) messages = result.messages;
    });

    let leaderboard = await User.find({ guild: message.guild.id }).lean();
    leaderboard = leaderboard.map((x) => {
      return {
        member: x.id,
        value: x.messages
      }
    }).sort((a, b) => b.value - a.value);
    let rank = leaderboard.findIndex((a) => a.member == user.id) + 1;
  
    let embed = new Discord.MessageEmbed()
      .setAuthor({ name: "Messages Count", iconURL: this.client.user.displayAvatarURL() })
      .setColor("BLURPLE")
      .setDescription(`> ${user.id == message.author.id ? "You" : user} sent **${messages}** Messages in Total.
> 
> **Leaderboard Rank:** #${rank}`);
  
    message.channel.send({ embeds: [embed] });
  }
  async slashRun(interaction, args) {
    var user = interaction.options.getUser("target") || interaction.user;
  
    let messages;
    await Guild.findOne({ id: interaction.guild.id }, (err, result) => {
      if (result) messages = result.messages;
    });

    let leaderboard = await User.find({ guild: interaction.guild.id }).lean();
    leaderboard = leaderboard.map((x) => {
      return {
        member: x.id,
        value: x.messages
      }
    }).sort((a, b) => b.value - a.value);
    let rank = leaderboard.findIndex((a) => a.member == user.id) + 1;
  
    let embed = new Discord.MessageEmbed()
      .setAuthor({ name: "Messages Count", iconURL: this.client.user.displayAvatarURL() })
      .setColor("BLURPLE")
      .setDescription(`> ${user.id == interaction.user.id ? "You" : user} sent **${messages}** Messages in Total.
> 
> **Leaderboard Rank:** #${rank}`);
  
    interaction.reply({ embeds: [embed] });
  }
};
