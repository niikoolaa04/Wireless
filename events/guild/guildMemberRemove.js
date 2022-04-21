const db = require("quick.db");
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
	  let disabledGuilds = await Bot.find({ name: "wireless "}).disabledGuilds;
	  if(disabledGuilds.includes(member.guild.id)) return;
    
    let settings = await Guild.find({ id: member.guild.id });

    let inviter = await User.findOne({ id: member.id, guild: member.guild.id }).inviter;
    if(inviter != member.id && inviter != "Unknown" && inviter != "Vanity URL") {
      await User.findOneAndUpdate({ id: inviter, guild: member.guild.id }, { $inc: { invitesLeaves: 1 } });
      await User.findOneAndUpdate({ id: inviter, guild: member.guild.id }, { $inc: { invitesRegular: -1 } });
      this.client.utils.pushHistory(member, inviter, `[ 📤 ] **${member.user.tag}** has **left** server.`);
    }
    invitesChannel = this.client.channels.cache.get(settings.invitesChannel);
    if (invitesChannel != null) {
      delay(1000);
      let invv = null;

      if(inviter == "Vanity URL") invv = "Vanity URL";
      else if(inviter == undefined  || inviter == null || inviter == "Unknown") invv = "Unknown";
      else invv = this.client.users.cache.get(inviter).tag;
        
      let inviterName = invv;
      
      let invitesCount = {
        joins: 0,
        regular: 0,
        leaves: 0,
        bonus: 0
      };
      
      await User.findOne({ id: inviter, guild: member.guild.id }, (err, result) => {
        if (result) {
          invitesCount.joins = result.invitesJoin;
          invitesCount.regular = results.invitesRegular;
          invitesCount.leaves = result.invitesLeaves;
          invitesCount.bonus = result.invitesBonus;
        }
      });
      
      if(invitesChannel !== null && invitesChannel !== undefined && msgLeave !== null) {
        invitesChannel.send({ content: `${msgLeave
          .replace("{userTag}", member.user.tag)
          .replace("{members}", member.guild.memberCount)
          .replace("{username}", member.user.username)
          .replace("{userID}", member.user.id)
          .replace("{invitedBy}", inviterName)
          .replace("{totalInvites}", parseInt(invitesCount.regular + invitesCount.bonus))
          .replace("{leavesInvites}", invitesCount.leaves)
          .replace("{bonusInvites}", invitesCount.bonus)
          .replace("{regularInvites}", invitesCount.regular)
          .replace("{joinsInvites}", invitesCount.joins)
          .replace("{created}", moment.utc(member.user.createdAt).tz("Europe/Belgrade").format("dddd, MMMM Do YYYY, HH:mm:ss"))}` });
      }
    }  
	}
};
