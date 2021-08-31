const Command = require("../../structures/Command");
const Discord = require('discord.js');
const ms = require('ms');
const db = require("quick.db");

module.exports = class GiveawayCreate extends Command {
	constructor(client) {
		super(client, {
			name: "gcreate",
			description: "Start new giveaway using interactive menu",
			usage: "gcreate",
			permissions: ["ADMINISTRATOR"],
			aliases: ["gwcreate", "gwsetup", "gsetup"],
			category: "giveaway",
			listed: true,
			slash: true,
		});
	}
    
  async run(message, args) {
    let embed = new Discord.MessageEmbed()
      .setColor("BLURPLE")
      .setAuthor("Giveaway Setup", this.client.user.displayAvatarURL());

    let filter = m => m.author.id === message.author.id;
    this.client.setupUtils.durationSetup(this.client, message, embed, filter);
  }

  async slashRun(interaction, args) {
    let embed = new Discord.MessageEmbed()
      .setColor("BLURPLE")
      .setAuthor("Giveaway Setup", this.client.user.displayAvatarURL());

    if(this.client.gwCreation.get(interaction.user.id) == true) return interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Error", `You have already started Giveaway Creation, type cancel to stop it.`, "RED")] });

    let filter = m => m.author.id === interaction.user.id;
    await interaction.deferReply();
    this.client.setupUtils.durationSetup(this.client, interaction, embed, filter);
    this.client.gwCreation.set(interaction.user.id, true);
  }
};