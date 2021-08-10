const db = require("quick.db");
const Discord = require("discord.js");
const Event = require("../../structures/Events");

module.exports = class MessageDelete extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(message) {
	  if (message.channel.type == 'DM') return;
    if(message.author == null || message.author == undefined) return;
	  if (message.author.bot) return;
    if(message.partial) await message.fetch();
	  
    let content = message.content;
    if (content.length > 2000) content = content.slice(0, 1024) + '...';
    
    if (message.attachments.size > 0) return;
    let snStatus = await db.fetch(`server_${message.guild.id}_snipes`);
    if(snStatus == true) this.client.snipes.set(message.guild.id, {
      author: message.author.id,
      content: content
    });
	} 
};