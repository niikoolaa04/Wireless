const Command = require("../../structures/Command");
const Discord = require('discord.js');
const ms = require('ms');
const db = require("quick.db");

module.exports = class GiveawayEdit extends Command {
  constructor(client) {
    super(client, {
      name: "gedit",
      description: "Edit giveaway informations",
      usage: "gedit [-m msgId] [-msgs messages] [-invs invites] [-w winners] [-d extra time] [-p prize]",
      permissions: ["ADMINISTRATOR"],
      aliases: ["gwedit"], 
      category: "giveaway",
      listed: true,
      slash: true,
      options: [{
        name: 'msgid',
        type: 'STRING',
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
    const parsed = this.client.utils.parseArgs(args, ['m:', 'msgs:', 'invs:', 'w:', 'd:', 'p:']);
    
    let messageID = parsed.options.m;
    let messagesArg = parsed.options.msgs || 0;
    let invitesArg = parsed.options.invs || 0;
    let winnersArg = parsed.options.w || 0;
    let endArg = parsed.options.d || 0;
    let prizeArg = parsed.options.p || 0;

    if (!messageID) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You haven't entered Message ID.", "RED")] });

    let giveaways = db.fetch(`giveaways_${message.guild.id}`);
    let gwData = giveaways.find(g => g.messageID == messageID && g.ended == false);
    
    if(!gwData) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You have entered invalid Message ID.", "RED")] });

    this.client.gw.editGiveaway(this.client, message, messageID, message.guild, parseInt(messagesArg), parseInt(invitesArg), parseInt(winnersArg), endArg, prizeArg);
    message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Giveaway", `Giveaway have been edited successfuly.`, "YELLOW")] });
  }
  async slashRun(interaction, args) {
    let messageID = parseInt(interaction.options.getString("msgid")) || 0;
    let messagesArg = interaction.options.getInteger("messages");
    let invitesArg = interaction.options.getInteger("invites");
    let winnersArg = interaction.options.getInteger("winners");
    let endArg = interaction.options.getString("end");
    let prizeArg = interaction.options.getString("prize");

    let giveaways = db.fetch(`giveaways_${interaction.guild.id}`);
    let gwData = giveaways.find(g => g.messageID == messageID && g.ended == false);
    
    if(!gwData) return interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Error", "You have entered invalid Message ID.", "RED")] });

    this.client.gw.editGiveaway(this.client, interaction, messageID, interaction.guild, parseInt(messagesArg), parseInt(invitesArg), parseInt(winnersArg), endArg, prizeArg);
    interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Giveaway", `Giveaway have been edited successfuly.`, "YELLOW")] });
  }
};