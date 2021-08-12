const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class Slowmode extends Command {
  constructor(client) {
    super(client, {
      name: "slowmode",
      description: "Change Channel's Slowmode",
      usage: "slowmode [Seconds]",
      permissions: ["MANAGE_MESSAGES"],
      category: "utility",
      listed: true,
      slash: true,
      options: [{
        name: 'seconds',
        type: 'INTEGER',
        description: "Seconds to slow down chat",
        required: true,
      }]
    });
  }

  async run(message, args) {
    let seconds = args[0]
    if(!seconds || isNaN(seconds)) return message.channel.send(
      { embeds: [ this.client.embedBuilder(this.client, message, "Error", "You haven't entered valid Number of Seconds", "RED" ) ] }
    );

    message.channel.setRateLimitPerUser(seconds);
    message.channel.send(
      { embeds: [ this.client.embedBuilder(this.client, message, "Slowmode", `Slowmode for ${message.channel} have been changed to **${seconds} seconds**`, "YELLOW" ) ] }
    ); 
  }
  async slashRun(interaction, args) {
    let seconds = interaction.options.getInteger("seconds");
    interaction.channel.setRateLimitPerUser(seconds);
    interaction.followUp(
      { embeds: [ this.client.embedInteraction(this.client, interaction, "Slowmode", `Slowmode for ${interaction.channel} have been changed to **${seconds} seconds**`, "YELLOW" ) ] }
    ); 
  }
};