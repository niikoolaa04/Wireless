const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Guild = require("../../models/Guild.js");

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
    let guildData = await Guild.findOne({ id: message.guild.id }, "prefix -_id");

    if (!prefix) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, 
      `Error`, "You haven't entered prefix.", "RED") ]});
    if (prefix === guildData.prefix) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, 
        `Error`, "New Prefix cannot be same as old one.", "RED") ]});
    await Guild.findOneAndUpdate({ id: message.guild.id }, { prefix: `${prefix}` }, { new: true, upsert: true });
  
    let embed = new Discord.MessageEmbed()
    .setAuthor({ name: "Prefix", iconURL: this.client.user.displayAvatarURL() })
    .setDescription(`Guild prefix have been successfully changed to \`${prefix}\``)
    .setColor("BLURPLE");
  
    message.channel.send({ embeds: [embed] });
  }
  async slashRun(interaction, args) {
    let prefix = interaction.options.getString("prefix");
    let guildData = await Guild.findOne({ id: interaction.guild.id }, "prefix -_id");

    if (prefix === guildData.prefix) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, 
        `Error`, "New Prefix cannot be same as old one.", "RED")], ephemeral: true });
    await Guild.findOneAndUpdate({ id: interaction.guild.id }, { prefix: `${prefix}` }, { new: true, upsert: true });
  
    let embed = new Discord.MessageEmbed()
      .setAuthor({ name: "Prefix", iconURL: this.client.user.displayAvatarURL() })
      .setDescription(`Guild prefix have been successfully changed to \`${prefix}\``)
      .setColor("BLURPLE");
  
    interaction.reply({ embeds: [embed] });
  }
};
