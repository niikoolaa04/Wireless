const Discord = require("discord.js");
const db = require("quick.db");
const Event = require("../../structures/Events");

module.exports = class InviteCreate extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(invite) {
	  invite.guild.fetchInvites().then(guildInvites => {
	    this.client.invites[invite.guild.id] = guildInvites;
	  });
  }
};