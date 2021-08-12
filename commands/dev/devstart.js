const Command = require("../../structures/Command");
const Discord = require('discord.js');
const ms = require('ms');
const db = require("quick.db");

module.exports = class GiveawayStart extends Command {
	constructor(client) {
		super(client, {
			name: "devstart",
			description: "Start new giveaway",
			usage: "devstart [duration] [#channel] [no. of winners] [messages req. || 0] [invites req. || 0] [role req, || 0] [prize]",
			permissions: ["ADMINISTRATOR"],
			aliases: ["dstart"],
			category: "dev",
			listed: false,
      // slash: true,
      // options: [{
      //   name: 'duration',
      //   type: 'STRING',
      //   description: 'Duration of Giveaway',
      //   required: true,
      // },{
      //   name: 'channel',
      //   type: 'CHANNEL',
      //   description: 'Channel in which to Start Giveaway',
      //   required: true,
      // },{
      //   name: 'winners',
      //   type: 'INTEGER',
      //   description: 'Number of Winners',
      //   required: true,
      // },{
      //   name: 'messages',
      //   type: 'INTEGER',
      //   description: 'Number of Messages Required to enter Giveaway',
      //   required: true,
      // },{
      //   name: 'invites',
      //   type: 'INTEGER',
      //   description: 'Number of Invites Required to enter Giveaway',
      //   required: true,
      // },{
      //   name: 'prize',
      //   type: 'STRING',
      //   description: 'Prize for Giveaway',
      //   required: true,
      // }]
		});
	}
    
  async run(message, args) {
    let durationArg = args[0];
    let channelArg = message.mentions.channels.first();
    let winnersArg = parseInt(args[2]);
    let messagesArg = args[3];
    let invitesArg = args[4];
    let roleArg = message.mentions.roles.first() || args[5];
    let prizeArg = args.slice(6).join(" ");
    
    if(!durationArg || isNaN(ms(durationArg))) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Giveaway Duration.", "RED")] });
    if(!channelArg) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have mentioned invalid Channel.", "RED")] });
    if(!winnersArg || isNaN(winnersArg) || winnersArg <= 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You haven't entered number of winners.", "RED")] });
    if(!messagesArg || isNaN(messagesArg) || messagesArg < 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Number of Messages Required for Entering Giveaway.", "RED")] });
    if(!invitesArg || isNaN(invitesArg) || invitesArg < 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Number of Invites Required for Entering Giveaway.", "RED")] });
    if(!roleArg) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have mentioned invalid role.", "RED")] });
    if(!prizeArg || prizeArg.length >= 256) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Prize.", "RED")] });

    let giveawayObject = this.client.utils.devObject(
      message.guild.id, 
      0, 
      ms(durationArg), 
      channelArg.id, 
      winnersArg, 
      parseInt(messagesArg), 
      parseInt(invitesArg), 
      roleArg,
      (Date.now() + ms(durationArg)), 
      message.author.id,
      prizeArg,
    );

    console.log(giveawayObject);

    // this.client.gw.startGiveaway(this.client, message, devObject);
    
    message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Giveaway", `Giveaway has started in Channel ${channelArg}.`, "YELLOW")] });
  }
  // async slashRun(interaction, args) {
  //   let durationArg = interaction.options.getString("duration");
  //   let channelArg = interaction.options.getChannel("channel");
  //   let winnersArg = interaction.options.getInteger("winners");
  //   let messagesArg = interaction.options.getInteger("messages");
  //   let invitesArg = interaction.options.getInteger("invites");
  //   let prizeArg = interaction.options.getString("prize");

  //   let giveawayObject = this.client.utils.giveawayObject(
  //     interaction.guild.id, 
  //     0, 
  //     ms(durationArg), 
  //     channelArg.id, 
  //     winnersArg, 
  //     parseInt(messagesArg), 
  //     parseInt(invitesArg), 
  //     (Date.now() + ms(durationArg)), 
  //     interaction.user.id,
  //     prizeArg,
  //   );
  //   this.client.gw.startGiveaway(this.client, interaction, giveawayObject);
    
  //   interaction.followUp({ embeds: [ this.client.embedInteraction(this.client, interaction, "Giveaway", `Giveaway has started in Channel ${channelArg}.`, "YELLOW")] });
  // }
};