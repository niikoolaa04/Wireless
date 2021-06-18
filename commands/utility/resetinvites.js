const Command = require("../../structures/Command");
const db = require("quick.db");
const Discord = require("discord.js");

module.exports = class ResetInvites extends Command {
	constructor(client) {
		super(client, {
			name: "resetinvites",
			description: "reset invites for user or guild",
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
      let leaves = await db.all().filter(data => data.ID.startsWith(`invitesLeaves_${message.guild.id}`));
      leaves.forEach(d => db.delete(d.ID));
      let total = await db.all().filter(data => data.ID.startsWith(`invitesTotal_${message.guild.id}`));
      total.forEach(d => db.delete(d.ID));
      let regular = await db.all().filter(data => data.ID.startsWith(`invitesRegular_${message.guild.id}`));
      regular.forEach(d => db.delete(d.ID));
      message.channel.send(this.client.embedBuilder(this.client, message, "Invites Reseted", "Invites of all users have been reseted", "YELLOW"));
    } else if(reset == "user") {
      db.delete(`invitesLeaves_${message.guild.id}_${user.id}`);
      db.delete(`invitesTotal_${message.guild.id}_${user.id}`);
      db.delete(`invitesRegular_${message.guild.id}_${user.id}`);
      message.channel.send(this.client.embedBuilder(this.client, message, "Invites Reseted", `Invites of user ${user} have been reseted`, "YELLOW"));
    }
  }
};