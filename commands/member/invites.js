const Command = require("../../structures/Command");
const Discord = require("discord.js");
const User = require("../../models/User");

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
    let leaderboard = await User.find({ guild: message.guild.id }).lean();
    leaderboard = leaderboard.map((x) => {
      return {
        member: x.id,
        value: x.invitesRegular
      }
    }).sort((a, b) => b.value - a.value);
    let rank = leaderboard.findIndex((a) => a.member == user.id) + 1;

    User.findOne({ id: user.id, guild: message.guild.id }, (err, result) => {
      console.log(result)
      console.log(result.invitesRegular)
      let inviter = this.client.users.cache.get(result.inviter);
      inviter = inviter ? inviter.username : 'Unknown User';

      let history = result.invitesHistory.length > 0 ? result.invitesHistory : ["No History"];
      let contentHistory = String();
      
      for (const inv of history.slice(0, 5)) {
        contentHistory += `\n> ${inv}`
      }
      
      let embed = new Discord.MessageEmbed()
        .setAuthor({ name: "Invites Count", iconURL: this.client.user.displayAvatarURL() })
        .setColor("BLURPLE")
        .setDescription(`> **User:** ${user.username}
      
> **${result.invitesRegular}** Invites \`(${result.invitesRegular + result.invitesBonus} total, ${result.invitesJoins} joins, ${result.invitesLeaves} leaves, ${result.invitesBonus} bonus)\`
      
**Leaderboard Rank:** #${rank}
**Invited by:** ${inviter}
      
🎟️ ・ Invites History
${contentHistory}`);
      
      message.channel.send({ embeds: [embed] });
    })
  }
  async slashRun(interaction, args) {
    var user = interaction.options.getUser("target") || interaction.user;
    let leaderboard = await User.find({ guild: interaction.guild.id }).lean();
    leaderboard = leaderboard.map((x) => {
      return {
        member: x.id,
        value: x.invitesRegular
      }
    }).sort((a,b) => b.value - a.value);
    let rank = leaderboard.findIndex((a) => a.member == user.id) + 1;

    User.findOne({ id: user.id, guild: interaction.guild.id }, (err, result) => {
      let inviter = this.client.users.cache.get(result.inviter);
      inviter = inviter ? inviter.username : 'Unknown User';
    
      let history = result.invitesHistory.length > 0 ? result.invitesHistory : ["No History"];
      let contentHistory = String();
      
      for(const inv of history.slice(0, 5)) {
        contentHistory += `\n> ${inv}`
      }
    
      let embed = new Discord.MessageEmbed()
        .setAuthor({ name: "Invites Count", iconURL: this.client.user.displayAvatarURL() })
        .setColor("BLURPLE")
        .setDescription(`> **User:** ${user.username}
> **${result.invitesRegular}** Invites \`(${result.invitesRegular + result.invitesBonus} total, ${result.invitesJoins} joins, ${result.invitesLeaves} leaves, ${result.invitesBonus} bonus)\`
      
**Leaderboard Rank:** #${rank}
**Invited by:** ${inviter}
      
🎟️ ・ Invites History
${contentHistory}`);
    
      interaction.reply({ embeds: [embed] });
    })
  }
};
