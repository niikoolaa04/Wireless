const Command = require("../../structures/Command");
const db = require("quick.db");
const Discord = require("discord.js");

module.exports = class Prefix extends Command {
	constructor(client) {
		super(client, {
			name: "prefix",
			description: "change bot prefix for this guild",
			usage: "Prefix [Prefix]",
			permissions: ["ADMINISTRATOR"],
			category: "utility",
			listed: true,
      slash: true,
      options: [{
        name: 'prefix',
        type: 'STRING',
        description: "New Prefix",
        required: true,
      }]
		});
	}
  
  async run(message, args) {
    let prefix = args[0];
    let real = db.fetch(`settings_${message.guild.id}_prefix`);
    if (!prefix) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, 
      `Error`, "You haven't entered prefix.", "RED") ]});
    if (prefix === real) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, 
        `Error`, "New Prefix cannot be same as old one.", "RED") ]});
    db.set(`settings_${message.guild.id}_prefix`, prefix);
  
    let embed = new Discord.MessageEmbed()
    .setAuthor("Prefix", this.client.user.displayAvatarURL())
    .setDescription(`Guild prefix have been successfully changed to \`${prefix}\``)
    .setColor("BLURPLE");
  
    message.channel.send({ embeds: [embed] });
  }
  async slashRun(interaction, args) {
    let prefix = interaction.options.getString("prefix");
    let real = db.fetch(`settings_${interaction.guild.id}_prefix`);
    if (prefix === real) return interaction.followUp({ embeds: [ this.client.embedInteraction(this.client, interaction, 
        `Error`, "New Prefix cannot be same as old one.", "RED") ]});
    db.set(`settings_${interaction.guild.id}_prefix`, prefix);
  
    let embed = new Discord.MessageEmbed()
      .setAuthor("Prefix", this.client.user.displayAvatarURL())
      .setDescription(`Guild prefix have been successfully changed to \`${prefix}\``)
      .setColor("BLURPLE");
  
    interaction.followUp({ embeds: [embed] });
  }
};