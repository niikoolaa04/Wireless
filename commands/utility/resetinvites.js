const Command = require("../../structures/Command");
const db = require("quick.db");
const Discord = require("discord.js");

module.exports = class ResetInvites extends Command {
	constructor(client) {
		super(client, {
			name: "resetinvites",
			description: "Reset invites for user or guild",
			usage: "resetinvites [all || user]",
			permissions: ["ADMINISTRATOR"],
			category: "utility",
			listed: true,
		});
	}
  
  async run(message, args) {
    let reset;
    let user = message.mentions.users.first() || this.client.users.cache.get(args[0]);
    if(user && user != undefined) reset = "user"
    else reset = "all";
    
    if(reset == "all") {
      let allInv = await db.all().filter(data => data.ID.startsWith(`invitesLeaves_${message.guild.id}`) && data.ID.startsWith(`invitesJoins_${message.guild.id}`) && data.ID.startsWith(`invitesRegular_${message.guild.id}`) && data.ID.startsWith(`invitesBonus_${message.guild.id}`));
      allInv.forEach(d => db.delete(d.ID));
      
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Invites Reseted", "Invites of all users have been reseted", "YELLOW") ]});
    } else if(reset == "user") {
      db.delete(`invitesLeaves_${message.guild.id}_${user.id}`);
      db.delete(`invitesBonus_${message.guild.id}_${user.id}`);
      db.delete(`invitesRegular_${message.guild.id}_${user.id}`);
      db.delete(`invitesJoins_${message.guild.id}_${user.id}`);
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Invites Reseted", `Invites of user ${user} have been reseted`, "YELLOW") ]});
    }
  }
};