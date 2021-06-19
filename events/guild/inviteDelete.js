const Discord = require("discord.js");
const db = require("quick.db");
const Event = require("../../structures/Events");

module.exports = class InviteDelete extends Event {
  constructor(...args) {
    super(...args);
  }

  async run(invite) {
    if(this.client.disabledGuilds.includes(invite.guild.id)) return;

    invite.guild.fetchInvites().then(guildInvites => {
      this.client.invites[invite.guild.id] = guildInvites;
    });
  }
};