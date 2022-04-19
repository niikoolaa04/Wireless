const Discord = require("discord.js");
const db = require("quick.db");
const Canvas = require("canvas");
const delay = require("delay");
const moment = require('moment-timezone');
moment.locale('sr-latn');
const Event = require("../../structures/Events");
const { isEqual, generateInvitesCache } = require("../../utils/utils.js");
const User = require("../../models/User.js");

module.exports = class GuildMemberAdd extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(member) {
	  if(this.client.disabledGuilds.includes(member.guild.id)) return;
	  if(!member.guild.me.permissions.has("MANAGE_GUILD")) return;

    let settings = await Guild.find({ id: member.guild.id });

    if(settings.wlcmImage != null && settings.welcomeChannel != null) {
      const applyText = (canvas, text) => {
      const ctx = canvas.getContext('2d');
      let fontSize = 40;
    
      do {
        ctx.font = `${fontSize -= 6}px sans-serif`;
        } while (ctx.measureText(text).width > canvas.width - 300);
      
        return ctx.font;
      };
  
      const canvas = Canvas.createCanvas(700, 310);
      const ctx = canvas.getContext('2d');
    
      const background = await Canvas.loadImage("./assets/wallpaper.jpg");
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
      ctx.strokeStyle = '#74037b';
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
      ctx.font = '25px Comfortaa';
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText(`welcome to the Server (#${member.guild.memberCount})!`, canvas.width / 2, canvas.height / 2 + 85);
    
      ctx.font = applyText(canvas, member.user.tag);
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Hey, " + member.user.username, canvas.width / 2, canvas.height / 2 + 55); 
    
      ctx.beginPath();
      ctx.arc(351, 105, 62, 0, Math.PI * 2, true);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "white";
      ctx.stroke();
      ctx.closePath();
      ctx.clip();
    
      const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
          format: 'png'
      }));
      ctx.drawImage(avatar, 281, 38, 140, 140);
    
      const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome.png');
      let channelImg = this.client.channels.cache.get(settings.welcomeChannel);
      await channelImg.send({ files: [attachment] });
    }
    
    let invite = null;
    let vanity = false;

    await member.guild.invites.fetch().catch(() => {});
    const guildInvites = generateInvitesCache(member.guild.invites.cache);
    const oldGuildInvites = this.client.invites[member.guild.id];
    if (guildInvites && oldGuildInvites) {
      this.client.invites[member.guild.id] = guildInvites;

      let inviteUsed = guildInvites.find((i) => oldGuildInvites.get(i.code) && ((Object.prototype.hasOwnProperty.call(oldGuildInvites.get(i.code), "uses") ? oldGuildInvites.get(i.code).uses : "Infinite") < i.uses));
      if ((isEqual(oldGuildInvites.map((i) => `${i.code}|${i.uses}`).sort(), guildInvites.map((i) => `${i.code}|${i.uses}`).sort())) && !inviteUsed && member.guild.features.includes("VANITY_URL")) {
        vanity = true;
      } else if (!inviteUsed) {
        const newAndUsed = guildInvites.filter((i) => !oldGuildInvites.get(i.code) && i.uses === 1);
        if (newAndUsed.size === 1) {
          inviteUsed = newAndUsed.first();
        }
      }
      if (inviteUsed && !vanity) invite = inviteUsed;
    } else if (guildInvites && !oldGuildInvites) {
      this.client.invites[member.guild.id] = guildInvites;
    }
    if (!invite && guildInvites) {
      const targetInvite = guildInvites.some((i) => i.targetUser && (i.targetUser.id === member.id));
      if (targetInvite.uses === 1) {
        invite = targetInvite;
      }
    }
    
    let inviter = null;
    if(vanity == false && (!invite || invite == undefined || invite == null)) inviter = "Unknown";
    else if(vanity == true && (!invite || invite == undefined || invite == null)) inviter = "Vanity URL"
    else inviter = this.client.users.cache.get(invite.inviter.id);

    if (inviter != "Unknown" && inviter != "Vanity URL") {
      await User.findOneAndUpdate({ id: member.id, guild: member.guild.id }, { inviter: `${inviter.id}` });

      if (inviter.id !== member.id) {
        db.add(`invitesRegular_${member.guild.id}_${inviter.id}`, 1);
        db.add(`invitesJoins_${member.guild.id}_${inviter.id}`, 1);
        this.client.utils.pushHistory(member, inviter.id, `[ 📥 ] **${member.user.tag}** has **joined** server.`);
      }
    } else {
      await User.findOneAndUpdate({ id: member.id, guild: member.guild.id }, { inviter: `${inviter}` });
    }

    let invitesChannel = this.client.channels.cache.get(settings.invitesChannel);

    let msgJoin = settings.joinMessage;
    if (invitesChannel != null && invitesChannel != undefined && msgJoin != null) {
      delay(1000);
      let inviter = await User.findOne({ id: member.id, guild: member.guild.id }).inviter;
      let invv = null;
      if (inviter == "Vanity URL") invv = "Vanity URL";
      else if (inviter == undefined || inviter == null || inviter == "Unknown") invv = "Unknown";
      else invv = this.client.users.cache.get(inviter).tag;

      let inviterName = invv;

      // ovde
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
	} 
};
