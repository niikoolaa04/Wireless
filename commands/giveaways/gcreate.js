const Command = require("../../structures/Command");
const Discord = require('discord.js');
const ms = require('ms');
const db = require("quick.db");

module.exports = class GiveawayCreate extends Command {
	constructor(client) {
		super(client, {
			name: "gcreate",
			description: "start new giveaway using interactive menu",
			usage: "gcreate",
			permissions: ["ADMINISTRATOR"],
			aliases: ["gwcreate", "gwsetup", "gsetup"],
			category: "giveaway",
			listed: true,
		});
	}
    
  async run(message, args) {
    let embed = new Discord.MessageEmbed()
      .setColor("BLURPLE")
      .setTitle("Giveaway Setup");
      
    embed.setDescription(`Enter Duration for Giveaway.`)
    message.channel.send(embed); 
    
    var m = await message.channel.awaitMessages((m) => { return m.author.id == message.author.id }, {
      max: 1
    })

    m = await m.first();
    let durationArg = m.content;
    
    embed.setDescription(`Mention Channel in which to start Giveaway.`);
    message.channel.send(embed);
    var m = await message.channel.awaitMessages((m) => { return m.author.id == message.author.id }, {
      max: 1
    })

    m = await m.first();
    let channel = m.mentions.channels.first();
    let channelArg = channel;
    if(!channel) return message.channel.send(this.client.embedBuilder(this.client, message, "Error", "You haven't mentioned Channel."));

    embed.setDescription(`Enter Number of Winners you want.`);
    message.channel.send(embed);
    var m = await message.channel.awaitMessages((m) => { return m.author.id == message.author.id }, {
      max: 1
    })

    m = await m.first();
    let winnersArg = m.content;
    if(isNaN(m.content)) return message.channel.send(this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Number of Winners.", "RED"));
    
    embed.setDescription(`Enter Number of Messages Required in order to Enter Giveaway - 0 for none.`);
    message.channel.send(embed);
    var m = await message.channel.awaitMessages((m) => { return m.author.id == message.author.id }, {
      max: 1
    })

    m = await m.first();
    let messagesArg = m.content;
    if(isNaN(m.content)) return message.channel.send(this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Number of Messages Required for Entering Giveaway.", "RED"));
    
    embed.setDescription(`Enter Number of Invites Required in order to Enter Giveaway - 0 for none.`);
    message.channel.send(embed);
    var m = await message.channel.awaitMessages((m) => { return m.author.id == message.author.id }, {
      max: 1
    })
    
    m = await m.first();
    let invitesArg = m.content;
    if(isNaN(invitesArg)) return message.channel.send(this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Number of Invites Required for Entering Giveaway.", "RED"));
    
    embed.setDescription(`Enter Prize for this Giveaway.`);
    message.channel.send(embed);
    var m = await message.channel.awaitMessages((m) => { return m.author.id == message.author.id }, {
      max: 1
    })
    
    m = await m.first();
    let prizeArg = m.content;
    if(!prizeArg || prizeArg.length < 3 || prizeArg.length > 256) return message.channel.send(this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Prize.", "RED"))

    let giveawayObject = this.client.utils.giveawayObject(
      message.guild.id, 
      0, 
      ms(durationArg), 
      channelArg, 
      parseInt(winnersArg), 
      parseInt(messagesArg), 
      parseInt(invitesArg), 
      (Date.now() + ms(durationArg)), 
      message.author.tag,
      prizeArg,
    );
    this.client.gw.startGiveaway(this.client, message, giveawayObject);
    
    message.channel.send(this.client.embedBuilder(this.client, message, "Giveaway", `Giveaway has started in <#${channelArg}>.`, "YELLOW"));
  }
};