const db = require("quick.db");
const Timeout = require("smart-timeout");
const delay = require("delay");
const moment = require('moment-timezone');
moment.locale('sr-latn');
const Event = require("../../structures/Events");
const Discord = require("discord.js");

module.exports = class GuildMemberRemove extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(member) {
    const inviter = db.fetch(`inviter_${member.guild.id}_${member.id}`);
    if(inviter != member.id && inviter != "Unknown" && inviter != "Vanity URL") {
      db.add(`invitesLeaves_${member.guild.id}_${inviter}`, 1);
      db.subtract(`invitesRegular_${member.guild.id}_${inviter}`, 1);
    }
    let invitesChannel = db.fetch(`channel_${member.guild.id}_invites`);
    invitesChannel = this.client.channels.cache.get(invitesChannel);
    if (invitesChannel != null) {
      delay(1000);
      let inviter = db.fetch(`inviter_${member.guild.id}_${member.id}`);
      let invv = null;

      if(inviter == "Vanity URL") invv = "Vanity URL";
      else if(inviter == undefined  || inviter == null || inviter == "Unknown") invv = "Unknown";
      else invv = this.client.users.cache.get(inviter).tag;
        
      let inviterName = invv;
      
      let total = db.fetch(`invitesTotal_${member.guild.id}_${inviter}`) || 0;
      let leaves = db.fetch(`invitesLeaves_${member.guild.id}_${inviter}`) || 0;
      let regular = db.fetch(`invitesRegular_${member.guild.id}_${member.id}`) || 0;
      let msgLeave = db.fetch(`server_${member.guild.id}_leaveMessage`); 
      if(invitesChannel !== null && invitesChannel !== undefined && msgLeave !== null) {
        invitesChannel.send(`${msgLeave
          .replace("{userTag}", member.user.tag)
          .replace("{members}", member.guild.memberCount)
          .replace("{username}", member.user.username)
          .replace("{userID}", member.user.id)
          .replace("{invitedBy}", inviterName)
          .replace("{leavesInvites}", leaves)
          .replace("{regularInvites}", regular)
          .replace("{totalInvites}", total)
          .replace("{created}", moment.utc(member.user.createdAt).tz("Europe/Belgrade").format("dddd, MMMM Do YYYY, HH:mm:ss"))}`);
      }
    }  
	}
};
