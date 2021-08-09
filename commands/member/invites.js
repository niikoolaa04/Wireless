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
      slash: true,
      options: [{
        name: 'target',
        type: 'USER',
        description: "User which Invites to view",
        required: false,
      }]
		});
	}

  async run(message, args) {
    var user = message.mentions.users.first() || this.client.users.cache.get(args[0]) || message.author;
  
    let joins = db.fetch(`invitesJoins_${message.guild.id}_${user.id}`) || 0;
    let left = db.fetch(`invitesLeaves_${message.guild.id}_${user.id}`) || 0;
    let regular = db.fetch(`invitesRegular_${message.guild.id}_${user.id}`) || 0;
    let bonus = db.fetch(`invitesBonus_${message.guild.id}_${user.id}`) || 0;
    let invitedBy = db.fetch(`inviter_${message.guild.id}_${user.id}`);
    let inviter = this.client.users.cache.get(invitedBy);
    inviter = inviter ? inviter.username : 'Unknown User';

    let every = db.all().filter(i => i.ID.startsWith(`invitesTotal_${message.guild.id}_`)).sort((a, b) => b.data - a.data);
    let rank = every.map(x => x.ID).indexOf(`invitesTotal_${message.guild.id}_${user.id}`) + 1 || 'N/A';
  
    let embed = new Discord.MessageEmbed()
      .setAuthor("Invites Count", this.client.user.displayAvatarURL())
      .setColor("BLURPLE")
      .setDescription(`> **User** · ${user.username}

> **${regular}** Invites \`(${regular + bonus} total, ${joins} joins, ${left} leaves, ${bonus} bonus)\`

**Leaderboard Rank:** #${rank}
**Invited by:** ${inviter}`);
  
    message.channel.send({ embeds: [embed] });
  }
  async slashRun(interaction, args) {
    var user = interaction.options.getUser("target") || interaction.user;
  
    let joins = db.fetch(`invitesJoins_${interaction.guild.id}_${user.id}`) || 0;
    let left = db.fetch(`invitesLeaves_${interaction.guild.id}_${user.id}`) || 0;
    let regular = db.fetch(`invitesRegular_${interaction.guild.id}_${user.id}`) || 0;
    let bonus = db.fetch(`invitesBonus_${interaction.guild.id}_${user.id}`) || 0;
    let invitedBy = db.fetch(`inviter_${interaction.guild.id}_${user.id}`);
    let inviter = this.client.users.cache.get(invitedBy);
    inviter = inviter ? inviter.username : 'Unknown User';

    let every = db.all().filter(i => i.ID.startsWith(`invitesRegular_${interaction.guild.id}_`)).sort((a, b) => b.data - a.data);
    let rank = every.map(x => x.ID).indexOf(`invitesRegular_${interaction.guild.id}_${user.id}`) + 1 || 'N/A';
  
    let embed = new Discord.MessageEmbed()
      .setAuthor("Invites Count", this.client.user.displayAvatarURL())
      .setColor("BLURPLE")
      .setDescription(`> **User** · ${user.username}
> **${regular}** Invites \`(${regular + bonus} total, ${joins} joins, ${left} leaves, ${bonus} bonus)\`

**Leaderboard Rank:** #${rank}
**Invited by:** ${inviter}`);
  
    interaction.followUp({ embeds: [embed] });
  }
};