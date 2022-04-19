const Command = require("../../structures/Command");
const Discord = require("discord.js");
const db = require("quick.db");

module.exports = class Invites extends Command {
	constructor(client) {
		super(client, {
			name: "invites",
			description: "User invites",
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
  
    let joins = await User.findOne({ id: user.id, guild: message.guild.id }).invitesJoins;
    let left = await User.findOne({ id: user.id, guild: message.guild.id }).invitesLeaves;
    let regular = await User.findOne({ id: user.id, guild: message.guild.id }).invitesRegular;
    let bonus = await User.findOne({ id: user.id, guild: message.guild.id }).invitesBonus;
    let invitedBy = await User.findOne({ id: user.id, guild: message.guild.id }).inviter;
    
    let inviter = this.client.users.cache.get(invitedBy);
    inviter = inviter ? inviter.username : 'Unknown User';

    let every = db.all().filter(i => i.ID.startsWith(`invitesRegular_${message.guild.id}_`)).sort((a, b) => b.data - a.data);
    let rank = every.map(x => x.ID).indexOf(`invitesRegular_${message.guild.id}_${user.id}`) + 1 || 'N/A';
    
    let history = await User.findOne({ id: user.id, guild: interaction.guild.id }).invitesHistory;
    history.length > 0 ? history : ["No History"];
    let contentHistory = String();
    
    for(const inv of history.slice(0, 5)) {
      contentHistory += `\n> ${inv}`
    }
  
    let embed = new Discord.MessageEmbed()
      .setAuthor({ name: "Invites Count", iconURL: this.client.user.displayAvatarURL() })
      .setColor("BLURPLE")
      .setDescription(`> **User:** ${user.username}

> **${regular}** Invites \`(${regular + bonus} total, ${joins} joins, ${left} leaves, ${bonus} bonus)\`

**Leaderboard Rank:** #${rank}
**Invited by:** ${inviter}

🎟️ ・ Invites History
${contentHistory}`);
  
    message.channel.send({ embeds: [embed] });
  }
  async slashRun(interaction, args) {
    var user = interaction.options.getUser("target") || interaction.user;
  
    let joins = await User.findOne({ id: user.id, guild: interaction.guild.id }).invitesJoins;
    let left = await User.findOne({ id: user.id, guild: interaction.guild.id }).invitesLeaves;
    let regular = await User.findOne({ id: user.id, guild: interaction.guild.id }).invitesRegular;
    let bonus = await User.findOne({ id: user.id, guild: interaction.guild.id }).invitesBonus;
    let invitedBy = await User.findOne({ id: user.id, guild: interaction.guild.id }).inviter;
    
    let inviter = this.client.users.cache.get(invitedBy);
    inviter = inviter ? inviter.username : 'Unknown User';

    let every = db.all().filter(i => i.ID.startsWith(`invitesRegular_${interaction.guild.id}_`)).sort((a, b) => b.data - a.data);
    let rank = every.map(x => x.ID).indexOf(`invitesRegular_${interaction.guild.id}_${user.id}`) + 1 || 'N/A';
  
    let history = await User.findOne({ id: user.id, guild: interaction.guild.id }).invitesHistory;
    history.length > 0 ? history : ["No History"];
    let contentHistory = String();
    
    for(const inv of history.slice(0, 5)) {
      contentHistory += `\n> ${inv}`
    }
  
    let embed = new Discord.MessageEmbed()
      .setAuthor({ name: "Invites Count", iconURL: this.client.user.displayAvatarURL() })
      .setColor("BLURPLE")
      .setDescription(`> **User:** ${user.username}
> **${regular}** Invites \`(${regular + bonus} total, ${joins} joins, ${left} leaves, ${bonus} bonus)\`

**Leaderboard Rank:** #${rank}
**Invited by:** ${inviter}

🎟️ ・ Invites History
${contentHistory}`);
  
    interaction.reply({ embeds: [embed] });
  }
};
