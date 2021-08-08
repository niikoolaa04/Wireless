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
      slash: true,
      options: [{
        name: 'duration',
        type: 'STRING',
        description: 'Enter Duration for Giveaway',
        required: true,
      },{
        name: 'channel',
        type: 'CHANNEL',
        description: 'Mention Channel to start Giveaway in',
        required: true,
      },{
        name: 'winners',
        type: 'INTEGER',
        description: 'Enter Number of Winners',
        required: true,
      },{
        name: 'messages',
        type: 'INTEGER',
        description: 'Enter Number of Messages Required',
        required: true,
      },{
        name: 'invites',
        type: 'INTEGER',
        description: 'Enter Number of Invites Required',
        required: true,
      },{
        name: 'prize',
        type: 'STRING',
        description: 'Enter Prize',
        required: true,
      }]
		});
	}
    
  async run(message, args) {
    let durationArg = args[0];
    let channelArg = message.mentions.channels.first();
    let winnersArg = parseInt(args[2]);
    let messagesArg = args[3];
    let invitesArg = args[4];
    let prizeArg = args.slice(5).join(" ");
    
    if(!durationArg || isNaN(ms(durationArg))) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Giveaway Duration.", "RED")] });
    if(!channelArg) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have mentioned invalid Channel.", "RED")] });
    if(!winnersArg || isNaN(winnersArg) || winnersArg <= 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You haven't entered number of winners.", "RED")] });
    if(!messagesArg || isNaN(messagesArg) || messagesArg < 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Number of Messages Required for Entering Giveaway.", "RED")] });
    if(!invitesArg || isNaN(invitesArg) || invitesArg < 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Number of Invites Required for Entering Giveaway.", "RED")] });
    if(!prizeArg || prizeArg.length >= 256) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Prize.", "RED")] });

    let giveawayObject = this.client.utils.giveawayObject(
      message.guild.id, 
      0, 
      ms(durationArg), 
      channelArg.id, 
      winnersArg, 
      parseInt(messagesArg), 
      parseInt(invitesArg), 
      (Date.now() + ms(durationArg)), 
      message.author.id,
      prizeArg,
    );
    this.client.gw.startGiveaway(this.client, message, giveawayObject);
    
    message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Giveaway", `Giveaway has started in Channel ${channelArg}.`, "YELLOW")] });
  }
  async slashRun(interaction, args) {
    let durationArg = interaction.options.getString("duration");
    let channelArg = interaction.options.getChannel("channel");
    let winnersArg = interaction.options.getInteger("winners");
    let messagesArg = interaction.options.getInteger("messages");
    let invitesArg = interaction.options.getInteger("invites");
    let prizeArg = interaction.options.getString("prize");

    let giveawayObject = this.client.utils.giveawayObject(
      message.guild.id, 
      0, 
      ms(durationArg), 
      channelArg.id, 
      winnersArg, 
      parseInt(messagesArg), 
      parseInt(invitesArg), 
      (Date.now() + ms(durationArg)), 
      message.author.id,
      prizeArg,
    );
    this.client.gw.startGiveaway(this.client, interaction, giveawayObject);
    
    interaction.followUp({ embeds: [ this.client.embedInteraction(this.client, interaction, "Giveaway", `Giveaway has started in Channel ${channelArg}.`, "YELLOW")] });
  }
};