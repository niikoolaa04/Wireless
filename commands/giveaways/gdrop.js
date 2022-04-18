const Command = require("../../structures/Command");
const Discord = require('discord.js');
const ms = require('ms');

module.exports = class GiveawayDrop extends Command {
  constructor(client) {
    super(client, {
      name: "gdrop",
      description: "Create Quick Giveaway in Current Channel",
      usage: "gdrop [duration] [winners] [prize]",
      permissions: ["ADMINISTRATOR"],
      aliases: ["gwdrop"],
      category: "giveaway",
      listed: true,
      slash: true,
      options: [{
        name: 'duration',
        type: 'STRING',
        description: 'Duration of Giveaway',
        required: true,
      },{
        name: 'winners',
        type: 'INTEGER',
        description: 'Number of Winners',
        required: true,
      },{
        name: 'prize',
        type: 'STRING',
        description: 'Prize for Giveaway',
        required: true,
      }],
    });
  }

  async run(message, args) {
    let durationArg = args[0];
    let winnersArg = args[1];
    let prizeArg = args[2];

    if(!durationArg || isNaN(ms(durationArg))) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You have entered invalid Giveaway Duration.", "RED")] });
    if(!winnersArg || isNaN(winnersArg) || winnersArg <= 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You haven't entered number of winners.", "RED")] });
    if(!prizeArg || prizeArg.length >= 32) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You have entered invalid Prize.", "RED")] });

    let giveawayObject = this.client.utils.giveawayObject(
      message.guild.id, 
      0, 
      ms(durationArg), 
      message.channel.id, 
      winnersArg, 
      0, 
      0, 
      (Date.now() + ms(durationArg)), 
      message.author.id,
      prizeArg,
    );
    this.client.gw.startGiveaway(this.client, message, giveawayObject);
    
    message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Giveaway", `Giveaway has started in Channel ${message.channel}.`, "YELLOW")] });
  }
  async slashRun(interaction, args) {
    let durationArg = interaction.options.getString("duration");
    let winnersArg = interaction.options.getInteger("winners");
    let prizeArg = interaction.options.getString("prize");

    if(isNaN(ms(durationArg))) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Error", "You have entered invalid Giveaway Duration.", "RED")], ephemeral: true });
    if(isNaN(winnersArg) || winnersArg <= 0) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Error", "You haven't entered number of winners.", "RED")], ephemeral: true });
    if(prizeArg.length >= 256) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Error", "You have entered invalid Prize.", "RED")], ephemeral: true });

    let giveawayObject = this.client.utils.giveawayObject(
      interaction.guild.id, 
      0, 
      ms(durationArg), 
      interaction.channel.id, 
      winnersArg, 
      0, 
      0, 
      (Date.now() + ms(durationArg)), 
      interaction.user.id,
      prizeArg,
    );
    // ovde
    this.client.gw.startGiveaway(this.client, interaction, giveawayObject);
    
    interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Giveaway", `Giveaway has started in Channel ${interaction.channel}.`, "YELLOW")] });
  }
};
