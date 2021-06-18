const Command = require("../../structures/Command");
const Discord = require('discord.js');
const ms = require('ms');
const db = require("quick.db");

module.exports = class GiveawayStart extends Command {
	constructor(client) {
		super(client, {
			name: "gstart",
			description: "start new giveaway",
			usage: "gstart [duration] [#channel] [no. of winners] [messages req. || 0] [invites req. || 0] [prize]",
			permissions: ["ADMINISTRATOR"],
			aliases: ["gwstart"],
			category: "giveaway",
			listed: true,
		});
	}
    
  async run(message, args) {
    let durationArg = args[0];
    let channelArg = message.mentions.channels.first();
    let winnersArg = parseInt(args[2]);
    let messagesArg = args[3];
    let invitesArg = args[4];
    let prizeArg = args.slice(5).join(" ");
    
    if(!durationArg || isNaN(ms(durationArg))) return message.channel.send(this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Giveaway Duration.", "RED"));
    if(!channelArg) return message.channel.send(this.client.embedBuilder(this.client, message, "Error", "You have mentioned invalid Channel.", "RED"));
    if(!winnersArg || isNaN(winnersArg) || winnersArg <= 0) return message.channel.send(this.client.embedBuilder(this.client, message, "Error", "You haven't entered number of winners.", "RED"));
    if(!messagesArg || isNaN(messagesArg) || messagesArg < 0) return message.channel.send(this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Number of Messages Required for Entering Giveaway.", "RED"));
    if(!invitesArg || isNaN(invitesArg) || invitesArg < 0) return message.channel.send(this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Number of Invites Required for Entering Giveaway.", "RED"));
    if(!prizeArg || prizeArg.length >= 256) return message.channel.send(this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Prize.", "RED"));

    let giveawayObject = this.client.utils.giveawayObject(
      message.guild.id, 
      0, 
      ms(durationArg), 
      channelArg.id, 
      winnersArg, 
      parseInt(messagesArg), 
      parseInt(invitesArg), 
      (Date.now() + ms(durationArg)), 
      message.author,
      prizeArg,
    );
    this.client.gw.startGiveaway(this.client, message, giveawayObject);
    
    message.channel.send(this.client.embedBuilder(this.client, message, "Giveaway", `Giveaway has started in Channel ${channelArg}.`, "YELLOW"));
  }
};