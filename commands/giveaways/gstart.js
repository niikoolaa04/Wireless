const Command = require("../../structures/Command");
const Discord = require('discord.js');
const ms = require('ms');
const db = require("quick.db");

module.exports = class GiveawayStart extends Command {
	constructor(client) {
		super(client, {
			name: "gstart",
			description: "Start new giveaway",
			usage: "gstart [duration] [#channel] [no. of winners] [@Role req. || 'none'] [messages req. || 0] [invites req. || 0] [prize]",
			permissions: ["ADMINISTRATOR"],
			aliases: ["gwstart"],
			category: "giveaway",
			listed: true,
      slash: true,
      options: [{
        name: 'duration',
        type: 'STRING',
        description: 'Duration of Giveaway',
        required: true,
      },{
        name: 'channel',
        type: 'CHANNEL',
        description: 'Channel in which to Start Giveaway',
        required: true,
      },{
        name: 'winners',
        type: 'INTEGER',
        description: 'Number of Winners',
        required: true,
      }, {
        name: 'role',
        type: 'ROLE',
        description: 'Role Required to enter Giveaway - Mention Bot Role for none',
        required: true,
      },{
        name: 'messages',
        type: 'INTEGER',
        description: 'Number of Messages Required to enter Giveaway',
        required: true,
      },{
        name: 'invites',
        type: 'INTEGER',
        description: 'Number of Invites Required to enter Giveaway',
        required: true,
      },{
        name: 'prize',
        type: 'STRING',
        description: 'Prize for Giveaway',
        required: true,
      }]
		});
	}
    
  async run(message, args) {
    let durationArg = args[0];
    let channelArg = message.mentions.channels.first();
    let winnersArg = parseInt(args[2]);
    let roleArg = message.mentions.roles.first() || args[3];
    let messagesArg = args[4];
    let invitesArg = args[5];
    let prizeArg = args.slice(6).join(" ");
    let premiumGuild = await Guild.findOne({ id: message.guild.id }).premium;
    
    if(!durationArg || isNaN(ms(durationArg))) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You have entered invalid Giveaway Duration.", "RED")] });
    if(!channelArg) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You have mentioned invalid Channel.", "RED")] });
    if(!winnersArg || isNaN(winnersArg) || winnersArg <= 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You haven't entered number of winners.", "RED")] });
    if(winnersArg > 20 && premiumGuild != true) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "To Create Giveaway with 20+ Winners you need Premium, get more informations using command `premium`.", "RED")] });
    if(!roleArg) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You have entered invalid Role Required for Entering Giveaway.", "RED")] });
    if(!messagesArg || isNaN(messagesArg) || messagesArg < 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You have entered invalid Number of Messages Required for Entering Giveaway.", "RED")] });
    if(!invitesArg || isNaN(invitesArg) || invitesArg < 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You have entered invalid Number of Invites Required for Entering Giveaway.", "RED")] });
    if(!prizeArg || prizeArg.length >= 32) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You have entered invalid Prize.", "RED")] });

    let giveawayObject = this.client.utils.giveawayObject(
      message.guild.id, 
      0, 
      ms(durationArg), 
      typeof(roleArg) == "object" ? `${roleArg.id}` : null,
      channelArg.id, 
      winnersArg, 
      parseInt(messagesArg), 
      parseInt(invitesArg), 
      (Date.now() + ms(durationArg)), 
      message.author.id,
      prizeArg,
    );
    this.client.gw.startGiveaway(this.client, message, giveawayObject);
    
    message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Giveaway", `Giveaway has started in Channel ${channelArg}.`, "YELLOW")] });
  }
  async slashRun(interaction, args) {
    let durationArg = interaction.options.getString("duration");
    let channelArg = interaction.options.getChannel("channel");
    let winnersArg = interaction.options.getInteger("winners");
    let roleArg = interaction.options.getRole("role");
    let messagesArg = interaction.options.getInteger("messages");
    let invitesArg = interaction.options.getInteger("invites");
    let prizeArg = interaction.options.getString("prize");
    let premiumGuild = await Guild.findOne({ id: interaction.guild.id }).premium;

    if(winnersArg > 20 && premiumGuild != true) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Error", "To Create Giveaway with 20+ Winners you need Premium, get more informations using command `premium`.", "RED")], ephemeral: true });

    let giveawayObject = this.client.utils.giveawayObject(
      interaction.guild.id, 
      0, 
      ms(durationArg),
      roleArg.tags.botId ? null : `${roleArg.id}`,
      channelArg.id, 
      winnersArg, 
      parseInt(messagesArg), 
      parseInt(invitesArg), 
      (Date.now() + ms(durationArg)), 
      interaction.user.id,
      prizeArg,
    );
    this.client.gw.startGiveaway(this.client, interaction, giveawayObject);
    
    interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Giveaway", `Giveaway has started in Channel ${channelArg}.`, "YELLOW")], ephemeral: true });
  }
};
