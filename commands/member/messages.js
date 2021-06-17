const Command = require("../../structures/Command");
const Discord = require("discord.js");
const db = require("quick.db");

module.exports = class Messages extends Command {
	constructor(client) {
		super(client, {
			name: "messages",
			description: "number of sent messages",
			usage: "messages [@User]",
			permissions: [],
			category: "member",
			listed: true,
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
      .setDescription(`> ${user.id == message.author.id ? "You" : user} have sent **${messages} Messages in Total.
> 
> **Leaderboard Rank:** ${rank}`);
  
    message.channel.send(embed);
  }
};