const Discord = require("discord.js");
const Event = require("../../structures/Events");
const User = require("../../models/User.js");
const Guild = require("../../models/Guild.js");
const Giveaway = require("../../models/Giveaway.js");

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
    let guildData = await Guild.findOne({ id: message.guild.id }, "customEmoji -_id");
    if(!guildData) guildData = await Guild.create({
      id: reaction.message.guild.id
    })
    
    if(reaction.emoji.name == guildData.customEmoji) {
      let giveaways = await Giveaway.find({ guild: message.guild.id });
      if(giveaways == null || giveaways.length < 1) return;
    
      let gwRunning = await Giveaway.find({ messageId: message.id, ended: false });
      if(!gwRunning) return;
      
      let invitesReq, bonusReq, msgReq, role, blRole;
      
      User.findOne({ id: user.id, guild: message.guild.id }, (err, result) => {
        if (result) {
          invitesReq = result.invitesRegular;
          bonusReq = result.invitesBonus;
          msgReq = result.messages;
        }
      });
      
      await Guild.findOne({ id: message.guild.id }, (err, result) => {
        if (result) {
          role = result.bypassRole;
          blRole = result.blacklistRole;
        }
      });
      
      let roleReq = gwRunning.requirements.roleReq;
      let gwInvites = gwRunning.requirements.invitesReq;
      let gwMsg = gwRunning.requirements.messagesReq; 
      let totalReq = parseInt(invitesReq + bonusReq);
    
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

      if(message.id != gwRunning.messageId) return;
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
