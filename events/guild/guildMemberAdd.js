const Discord = require("discord.js");
const Event = require("../../structures/Events");
const User = require("../../models/User.js");
const Guild = require("../../models/Guild.js");
const Canvas = require("canvas");
const delay = require("delay");
const { isEqual, generateInvitesCache } = require("../../utils/utils.js");
const moment = require('moment-timezone');
moment.locale('sr-latn');

module.exports = class GuildMemberAdd extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(member) {
	  if(this.client.disabledGuilds.includes(member.guild.id)) return;
	  if(!member.guild.me.permissions.has("MANAGE_GUILD")) return;

    // temporary
    Guild.findOne({ guild: member.guild.id }, async(err, result) => {
      if(!result) {
        await Guild.create({
          id: member.guild.id,
        });
      }
    });

    let usrData = await User.findOne({ id: member.id, guild: member.guild.id });
    if(!usrData) usrData = await User.create({
      id: member.id,
      guild: member.guild.id
    });

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
      console.log('test test here')
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
      await User.findOneAndUpdate({ id: member.id, guild: member.guild.id }, { inviter: `${inviter.id}` }, { new: true, upsert: true });

      if (inviter.id != member.id) {
        await User.findOneAndUpdate({ id: inviter.id, guild: member.guild.id }, { $inc: { invitesRegular: 1, invitesJoins: 1 } }, { new: true, upsert: true });
        this.client.utils.pushHistory(member, inviter.id, `[ 📥 ] **${member.user.tag}** has **joined** server.`);
      }
    } else {
      await User.findOneAndUpdate({ id: member.id, guild: member.guild.id }, { inviter: `${inviter}` }, { new: true, upsert: true });
    }

    let invitesChannel = this.client.channels.cache.get(settings.invitesChannel);

    let msgJoin = settings.joinMessage;
    if (invitesChannel != null && invitesChannel != undefined && msgJoin != null) {
      delay(1000);
      let inviterData = await User.findOne({ id: member.id, guild: member.guild.id }, "inviter");
      let invv = null;
      if (inviterData == "Vanity URL") invv = "Vanity URL";
      else if (inviterData == undefined || inviterData == null || inviter == "Unknown") invv = "Unknown";
      else invv = this.client.users.cache.get(inviterData).tag;

      let inviterName = invv;
      let invitesCount = {
        joins: 0,
        regular: 0,
        leaves: 0,
        bonus: 0
      };
      
      User.findOne({ id: inviterData, guild: member.guild.id }, (err, result) => {
        if (result) {
          invitesCount.joins = result.invitesJoin;
          invitesCount.regular = result.invitesRegular;
          invitesCount.leaves = result.invitesLeaves;
          invitesCount.bonus = result.invitesBonus;
        }
      });

      invitesChannel.send({ content: `${msgJoin
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
};
