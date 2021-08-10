const Command = require("../../structures/Command");
const Discord = require('discord.js');
const ms = require('ms');
const db = require("quick.db");

module.exports = class GiveawayEdit extends Command {
  constructor(client) {
    super(client, {
      name: "gedit",
      description: "Edit giveaway informations",
      usage: "gedit [message id] [messages req. || none] [invites req. || none] [no. of winners || none] [extra time || none] [prize || none]",
      permissions: ["ADMINISTRATOR"],
      aliases: ["gwedit"], 
      category: "giveaway",
      listed: true,
      slash: true,
      options: [{
        name: 'msgid',
        type: 'INTEGER',
        description: 'Message ID of Giveaway',
        required: true,
      },{
        name: 'messages',
        type: 'INTEGER',
        description: 'New Number of Messages Required, 0 for none',
        required: true,
      },{
        name: 'invites',
        type: 'INTEGER',
        description: 'New Number of Invites Required, 0 for none',
        required: true,
      },{
        name: 'winners',
        type: 'INTEGER',
        description: 'New Number of Winners, 0 for none',
        required: true,
      },{
        name: 'end',
        type: 'STRING',
        description: "Extra amount of time, 0 for none",
        required: true,
      },{
        name: 'prize',
        type: 'STRING',
        description: 'New Prize, 0 for none',
        required: true,
      }]
    });
  }

  async run(message, args) {
    let messageID = args[0];
    let messagesArg = args[1];
    let invitesArg = args[2];
    let winnersArg = args[3];
    let endArg = args[4];
    let prizeArg = args.slice(5).join(" ");

    if (!endArg || isNaN(ms(endArg))) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You haven't entered extra time for Giveaway (0 if you don't want).", "RED")] });
    if (!messageID) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You haven't entered Message ID.", "RED")] });
    if (!winnersArg || isNaN(winnersArg) || winnersArg <= 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Number of Winners (0 if you don't want).", "RED")] });
    if (!messagesArg || isNaN(messagesArg) || messagesArg < 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Number of Messages Required for Entering Giveaway (0 if you don't want).", "RED")] });
    if (!invitesArg || isNaN(invitesArg) || invitesArg < 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Number of Invites Required for Entering Giveaway (0 if you don't want).", "RED")] });
    if (!prizeArg || prizeArg.length >= 256) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid prize (0 if you don't want).", "RED")] });

    let giveaways = db.fetch(`giveaways_${message.guild.id}`);
    let gwData = giveaways.find(g => g.messageID == messageID && g.ended == false);
    
    if(!gwData) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Message ID.", "RED")] });

    this.client.gw.editGiveaway(this.client, message, messageID, message.guild, parseInt(messagesArg), parseInt(invitesArg), parseInt(winnersArg), ms(endArg), prizeArg);
    message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Giveaway", `Giveaway have been edited successfuly.`, "YELLOW")] });
  }
  async slashRun(interaction, args) {
    let messageID = interaction.options.getInteger("msgid");
    let messagesArg = interaction.options.getInteger("messages");
    let invitesArg = interaction.options.getInteger("invites");
    let winnersArg = interaction.options.getInteger("winners");
    let endArg = interaction.options.getString("end");
    let prizeArg = interaction.options.getString("prize");

    let giveaways = db.fetch(`giveaways_${interaction.guild.id}`);
    let gwData = giveaways.find(g => g.messageID == messageID && g.ended == false);
    
    if(!gwData) return interaction.followUp({ embeds: [ this.client.embedInteraction(this.client, interaction, "Error", "You have entered invalid Message ID.", "RED")] });

    this.client.gw.editGiveaway(this.client, interaction, messageID, interaction.guild, parseInt(messagesArg), parseInt(invitesArg), parseInt(winnersArg), ms(endArg), prizeArg);
    interaction.followUp({ embeds: [ this.client.embedInteraction(this.client, interaction, "Giveaway", `Giveaway have been edited successfuly.`, "YELLOW")] });
  }
};