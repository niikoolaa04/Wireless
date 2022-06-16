const Discord = require("discord.js");
const Event = require("../../structures/Events");
const User = require("../../models/User.js");
const Guild = require("../../models/Guild.js");
const delay = require("delay");
const moment = require('moment-timezone');
moment.locale('sr-latn');

module.exports = class GuildMemberRemove extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(member) {
	  if(this.client.disabledGuilds.includes(member.guild.id)) return;
    
    let settings = await Guild.find({ id: member.guild.id });

    let inviterUser = await User.findOne({ id: member.id, guild: member.guild.id }, "inviter");
    if(inviterUser.inviter != member.id && inviterUser.inviter != "Unknown" && inviterUser.inviter != "Vanity URL") {
      await User.findOneAndUpdate({ id: inviterUser.inviter, guild: member.guild.id }, { $inc: { invitesRegular: -1, invitesLeaves: 1 } }, { new: true, upsert: true });
      this.client.utils.pushHistory(member, inviterUser.inviter, `[ 📤 ] **${member.user.tag}** has **left** server.`);
    }
    let invitesChannel = this.client.channels.cache.get(settings.invitesChannel);
    if (invitesChannel != null) {
      delay(1000);
      let invv = null;

      if(inviterUser.inviter == "Vanity URL") invv = "Vanity URL";
      else if(inviterUser.inviter == undefined  || inviterUser.inviter == null || inviterUser.inviter == "Unknown") invv = "Unknown";
      else invv = this.client.users.cache.get(inviterUser.inviter).tag;
        
      let inviterName = invv;
      
      let invitesCount = {
        joins: 0,
        regular: 0,
        leaves: 0,
        bonus: 0
      };
      
      User.findOne({ id: inviterUser.inviter, guild: member.guild.id }, (err, result) => {
        if (result) {
          invitesCount.joins = result.invitesJoin;
          invitesCount.regular = result.invitesRegular;
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
          .replace("{invitedBy}", inviterUser.inviterName)
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
