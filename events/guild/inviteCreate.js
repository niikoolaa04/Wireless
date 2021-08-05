const Discord = require("discord.js");
const db = require("quick.db");
const Event = require("../../structures/Events");

module.exports = class InviteCreate extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(invite) {
	  if(this.client.disabledGuilds.includes(invite.guild.id)) return;
    if(!invite.guild.me.permissions.has("MANAGE_GUILD")) return;
    
	  invite.guild.invites.fetch().then(guildInvites => {
	    this.client.invites[invite.guild.id] = guildInvites;
	  });
  }
};