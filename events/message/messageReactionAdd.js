const Discord = require("discord.js");
const db = require("quick.db");
const fs = require("fs");
const Event = require("../../structures/Events");

module.exports = class MessageReactionAdd extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(reaction, user) {
    if(user.bot) return;
    if(reaction.partial) await reaction.fetch();
    if(reaction.message.partial) await reaction.message.fetch();
    if(this.client.disabledGuilds.includes(reaction.message.guild.id)) return;
    if(user.partial) await user.fetch();
    const message = reaction.message;
    if(message.channel.type === "DM") return;
    let member = message.guild.members.cache.get(user.id);
    
    if(reaction.emoji.name == "🎉") {
      let giveaways = db.fetch(`giveaways_${message.guild.id}`);
      if(giveaways == null || giveaways.length < 1) return;
    
      let gwRunning = giveaways.find(g => g.messageID == message.id && g.ended == false);
      if(!gwRunning) return;
      
      let invitesReq = db.fetch(`invitesRegular_${message.guild.id}_${user.id}`);
      let bonusReq = db.fetch(`invitesBonus_${message.guild.id}_${user.id}`); 
      let msgReq = db.fetch(`messages_${message.guild.id}_${user.id}`);
      let roleReq = db.fetch(`server_${message.guild.id}_roleReq`);
      let gwInvites = gwRunning.requirements.invitesReq;
      let gwMsg = gwRunning.requirements.messagesReq; 
      let totalReq = parseInt(invitesReq + bonusReq);
      let role = db.fetch(`server_${message.guild.id}_bypassRole`);
      let blRole = db.fetch(`server_${message.guild.id}_blacklistRole`);
    
      let denyEmbed = new Discord.MessageEmbed()
        .setTitle("🎁・Giveaway Entry")
        .setColor("RED")
        .setThumbnail(this.client.user.displayAvatarURL());
      let approveEmbed = new Discord.MessageEmbed()
        .setTitle("🎁・Giveaway Entry")
        .setColor("YELLOW")
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(`**${this.client.emojisConfig.prize} Giveaway:** ${gwRunning.prize}

Your Giveaway Entry in **${message.guild.name}** has been \`approved\`.`);

      if(message.id != gwRunning.messageID) return;
      if(role != null && member.roles.cache.has(role)) return user.send({ embeds: [approveEmbed] });
      let haveInvites = true;
      let haveMessages = true;
      let haveRole = true;
      let isBlacklist = false;
      if(blRole != null && member.roles.cache.has(blRole)) {
        denyEmbed.setDescription(`**${this.client.emojisConfig.prize} Giveaway:** ${gwRunning.prize}

Your Giveaway Entry in **${message.guild.name}** has been \`declined\`.

**${this.client.emojisConfig.role} There is problem with your current Roles:**
> **›** You have an Role which is blacklisted from Entering Giveaways.`);
        reaction.users.remove(user);
        isBlacklist = true;
        user.send({ embeds: [denyEmbed] });
      }
      if(isBlacklist == false && gwInvites > 0 && totalReq < gwInvites) {
        denyEmbed.setDescription(`**${this.client.emojisConfig.prize} Giveaway:** ${gwRunning.prize}

Your Giveaway Entry in **${message.guild.name}** has been \`declined\`.

**${this.client.emojisConfig.tasks} You don't meet Requirement:**
> **›** You need **${gwRunning.requirements.invitesReq}** Invite(s) to Enter Giveaway.`);
        reaction.users.remove(user);
        haveInvites = false;
        user.send({ embeds: [denyEmbed] });
      }
      if(isBlacklist == false && haveInvites == true && gwMsg > 0 && msgReq < gwMsg) {
        denyEmbed.setDescription(`**${this.client.emojisConfig.prize} Giveaway:** ${gwRunning.prize}

Your Giveaway Entry in **${message.guild.name}** has been \`declined\`.

**${this.client.emojisConfig.tasks} You don't meet Requirement:**
> **›** You need **${gwRunning.requirements.messagesReq}** Message(s) to Enter Giveaway.`);
        reaction.users.remove(user);
        haveMessages = false;
        user.send({ embeds: [denyEmbed] });
      }
      if(isBlacklist == false && haveInvites == true && haveMessages == true && roleReq != null && !member.roles.cache.has(roleReq)) {
        denyEmbed.setDescription(`**${this.client.emojisConfig.prize} Giveaway:** ${gwRunning.prize}

Your Giveaway Entry in **${message.guild.name}** has been \`declined\`.

**${this.client.emojisConfig.tasks} You don't meet Requirement:**
> **›** You need **${message.guild.roles.cache.get(roleReq).name}** Role to Enter Giveaway.`);
        reaction.users.remove(user);
        haveRole = false;
        user.send({ embeds: [denyEmbed] });
      }
      if(haveInvites == true && haveMessages == true && haveRole == true && isBlacklist == false) {
        denyEmbed.setDescription(`**${this.client.emojisConfig.prize} Giveaway:** ${gwRunning.prize}

Your Giveaway Entry in **${message.guild.name}** has been \`approved\`.`);
        denyEmbed.setColor("YELLOW")
        user.send({ embeds: [denyEmbed] });
      }
    }
	}
};