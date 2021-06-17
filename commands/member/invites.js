const Command = require("../../structures/Command");
const Discord = require("discord.js");
const db = require("quick.db");

module.exports = class Invites extends Command {
	constructor(client) {
		super(client, {
			name: "invites",
			description: "user invites",
			usage: "invites [@User]",
			permissions: [],
			category: "member",
			listed: true,
		});
	}

  async run(message, args) {
    var user = message.mentions.users.first() || this.client.users.cache.get(args[0]) || message.author;
  
    let total = db.fetch(`invitesTotal_${message.guild.id}_${user.id}`) || 0;
    let left = db.fetch(`invitesLeaves_${message.guild.id}_${user.id}`) || 0;
    let regular = db.fetch(`invitesRegular_${message.guild.id}_${user.id}`) || 0;
    let invitedBy = db.fetch(`inviter_${message.guild.id}_${user.id}`);
    let inviter = this.client.users.cache.get(invitedBy);
    inviter = inviter ? inviter.username : 'Unknown User';

    let every = db.all().filter(i => i.ID.startsWith(`invitesTotal_${message.guild.id}_`)).sort((a, b) => b.data - a.data);
    let rank = every.map(x => x.ID).indexOf(`invitesTotal_${message.guild.id}_${user.id}`) + 1 || 'N/A';
  
    let embed = new Discord.MessageEmbed()
      .setAuthor("Invites", this.client.user.displayAvatarURL())
      .setColor("BLURPLE")
      .setDescription(`> **User** · ${user.username}

> Total Invites · \`${total}\`
> Regular Invites · \`${regular}\`
> Leaves Invites · \`${left}\`

**Leaderboard Rank:** #${rank}
**Invited by:** ${inviter}`);
  
    message.channel.send(embed);
  }
};