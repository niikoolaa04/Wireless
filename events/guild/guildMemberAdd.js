const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");
const Timeout = require("smart-timeout");
const delay = require("delay");
const moment = require('moment-timezone');
moment.locale('sr-latn');
const Event = require("../../structures/Events");

module.exports = class GuildMemberAdd extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(member) {
	  if(this.client.disabledGuilds.includes(member.guild.id)) return;
	  
	  if(!member.guild.me.permissions.has("MANAGE_GUILD")) return;
    member.guild.invites.fetch().then(async guildInvites => {
      const ei = this.client.invites[member.guild.id];
  
      this.client.invites[member.guild.id] = guildInvites;
  
      const invite = guildInvites.find(i => !ei.get(i.code) || ei.get(i.code).uses < i.uses) || member.guild.vanityURLCode || null || undefined;
      
      let inviter = null;
      if(!invite || invite == undefined || invite == null) inviter = "Unknown";
      else if(invite == member.guild.vanityURLCode) inviter = "Vanity URL"
      else inviter = this.client.users.cache.get(invite.inviter.id);
      
      if(inviter != "Unknown" && inviter != "Vanity URL") {
        db.set(`inviter_${member.guild.id}_${member.id}`, inviter.id);

        if(inviter.id !== member.id) {
          db.add(`invitesRegular_${member.guild.id}_${inviter.id}`, 1);
          db.add(`invitesJoins_${member.guild.id}_${inviter.id}`, 1);
        }
      } else {
        db.set(`inviter_${member.guild.id}_${member.id}`, inviter);
      }
      
      let invitesChannel = db.fetch(`channel_${member.guild.id}_invites`);
      invitesChannel = this.client.channels.cache.get(invitesChannel); 
      
      let msgJoin = db.fetch(`server_${member.guild.id}_joinMessage`);  
      if(invitesChannel != null && invitesChannel != undefined && msgJoin != null) {
        delay(1000);
        let inviter = db.fetch(`inviter_${member.guild.id}_${member.id}`);
        let invv = null;
        if(inviter == "Vanity URL") invv = "Vanity URL";
        else if(inviter == undefined  || inviter == null || inviter == "Unknown") invv = "Unknown";
        else invv = this.client.users.cache.get(inviter).tag;
        
        let inviterName = invv;
        
        let joins = db.fetch(`invitesJoins_${member.guild.id}_${inviter}`) || 0;
        let regular = db.fetch(`invitesRegular_${member.guild.id}_${inviter}`) || 0;
        let leaves = db.fetch(`invitesLeaves_${member.guild.id}_${inviter}`) || 0;
        let bonus = db.fetch(`invitesBonus_${member.guild.id}_${inviter}`) || 0;

        invitesChannel.send({ content: `${msgJoin
          .replace("{userTag}", member.user.tag)
          .replace("{members}", member.guild.memberCount)
          .replace("{username}", member.user.username)
          .replace("{userID}", member.user.id)
          .replace("{invitedBy}", inviterName)
          .replace("{totalInvites}", parseInt(regular + bonus))
          .replace("{leavesInvites}", leaves)
          .replace("{bonusInvites}", bonus)
          .replace("{regularInvites}", regular)
          .replace("{joinsInvites}", joins)
          .replace("{created}", moment.utc(member.user.createdAt).tz("Europe/Belgrade").format("dddd, MMMM Do YYYY, HH:mm:ss"))}` });
      } 
    });
	} 
};
