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
    const message = reaction.message;
    if(message.channel.type === "dm") return;
    
    if(reaction.emoji.name == "🎉") {
      let giveaways = db.fetch(`giveaways_${message.guild.id}`);
      if(giveaways == null || giveaways.length < 1) return;
    
      let gwRunning = giveaways.find(g => g.messageID == message.id && g.ended == false);
      if(!gwRunning) return;
      
      let invitesReq = db.fetch(`invitesRegular_${message.guild.id}_${user.id}`);
      let msgReq = db.fetch(`poslatePoruke_${message.guild.id}_${user.id}`);
      let gwInvites = gwRunning.requirements.invitesReq;
      let gwMsg = gwRunning.requirements.messagesReq; 
    
      if(message.id != gwRunning.messageID) return;
      if(gwInvites > 0 && invitesReq < gwInvites) return reaction.users.remove(user);
      if(gwMsg > 0 && msgReq < gwMsg) return reaction.users.remove(user);
    }
	}
};