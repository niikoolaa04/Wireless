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
  
    let messages = db.fetch(`messages_${message.guild.id}_${user.id}`) || 0;

    let every = db.all().filter(i => i.ID.startsWith(`messages_${message.guild.id}_`)).sort((a, b) => b.data - a.data);
    let rank = every.map(x => x.ID).indexOf(`messages_${message.guild.id}_${user.id}`) + 1 || 'N/A';
  
    let embed = new Discord.MessageEmbed()
      .setAuthor("Messages Count", this.client.user.displayAvatarURL())
      .setColor("BLURPLE")
      .setDescription(`> ${user.id == message.author.id ? "You" : user} sent **${messages}** Messages in Total.
> 
> **Leaderboard Rank:** #${rank}`);
  
    message.channel.send({ embeds: [embed] });
  }
  async slashRun(interaction, args) {
    var user = interaction.options.getUser("target") || interaction.user;
  
    let messages = db.fetch(`messages_${interaction.guild.id}_${user.id}`) || 0;

    let every = db.all().filter(i => i.ID.startsWith(`messages_${interaction.guild.id}_`)).sort((a, b) => b.data - a.data);
    let rank = every.map(x => x.ID).indexOf(`messages_${interaction.guild.id}_${user.id}`) + 1 || 'N/A';
  
    let embed = new Discord.MessageEmbed()
      .setAuthor("Messages Count", this.client.user.displayAvatarURL())
      .setColor("BLURPLE")
      .setDescription(`> ${user.id == interaction.user.id ? "You" : user} sent **${messages}** Messages in Total.
> 
> **Leaderboard Rank:** #${rank}`);
  
  interaction.followUp({ embeds: [embed] });
  }
};