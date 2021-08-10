const Command = require("../../structures/Command");
const Discord = require("discord.js");
const db = require("quick.db");

module.exports = class Help extends Command {
	constructor(client) {
		super(client, {
			name: "help",
			description: "List all available commands and view informations about them",
			usage: "help [command | category]",
			permissions: [],
			category: "korisnik",
			listed: false,
      slash: true,
		});
	} 
	async run(message, args) {
    let prefix = await db.fetch(`settings_${message.guild.id}_prefix`);
    if (prefix === null) prefix = this.client.config.prefix;
    let user = message.author;
    let commandArg = args[0];
    
    if(!commandArg) {
      let commandsArray = this.client.commands.filter(
          c => c.listed === true
        );
      let loadedCommands = [...commandsArray.values()];
      
      let contentMember = this.client.utils.commandsList(this.client, message, "member");
      let contentGiveaway = this.client.utils.commandsList(this.client, message, "giveaway");
      let contentUtility = this.client.utils.commandsList(this.client, message, "utility");
      
      let cmdEmbed = new Discord.MessageEmbed()
        .setTitle(`🚀 · Help Menu`)
        .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
        .addField(`${this.client.emojisConfig.members} Member`, 
`${contentMember}`)
        .addField(`${this.client.emojisConfig.prize} Giveaway`, 
`${contentGiveaway}`)
        .addField(`${this.client.emojisConfig.utility} Utility`,
`${contentUtility}`)
        .addField(`${this.client.emojisConfig.gem} Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Vote for me](${this.client.config.links.voteURL}) | [Website](${this.client.config.links.website}) | [Support Server](${this.client.config.links.supportServer})`)
        .setTimestamp()
        .setColor("BLURPLE")
        .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
        .setFooter(`Total Commands ${loadedCommands.length}`, message.author.displayAvatarURL({ size: 1024, dynamic: true }));
      message.channel.send({ embeds: [cmdEmbed] });
    } else {
      let cmd = this.client.commands.get(commandArg);
      if (!cmd) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, `Error`
        , `You have entered invalid command/category.`, "RED") ]});
      if (
        cmd.category === "dev" &&
        message.author.id !== this.client.config.developer.id
      ) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, `Error`
        , `You have entered command/category which doesn't exist.`, "RED") ]});
  
      let embed = new Discord.MessageEmbed()
        .setTitle("🚀 · Informations About Command")
        .setDescription(
  `> **Command** · \`${cmd.name}\`
> **Description** · \`${cmd.description}\`
> **Usage** · \`${prefix}${cmd.usage}\`
> **Category** · \`${this.client.utils.capitalizeFirstLetter(cmd.category)}\``)
        .setColor("BLURPLE")
        .setFooter(this.client.config.footer, this.client.user.displayAvatarURL({ size: 1024, dynamic: true }))
        .setTimestamp();
  
      message.channel.send({ embeds: [embed] });
    }
  }
  async slashRun(interaction, args) {
    let prefix = await db.fetch(`settings_${interaction.guild.id}_prefix`);
    if (prefix === null) prefix = this.client.config.prefix;
    
    let commandsArray = this.client.commands.filter(
      c => c.listed === true
    );
    let loadedCommands = [...commandsArray.values()];
    
    let contentMember = this.client.utils.commandsList(this.client, interaction, "member");
    let contentGiveaway = this.client.utils.commandsList(this.client, interaction, "giveaway");
    let contentUtility = this.client.utils.commandsList(this.client, interaction, "utility");
    
    let cmdEmbed = new Discord.MessageEmbed()
      .setTitle(`🚀 · Help Menu`)
      .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
      .addField(`${this.client.emojisConfig.members} Member`, 
  `${contentMember}`)
      .addField(`${this.client.emojisConfig.prize} Giveaway`, 
  `${contentGiveaway}`)
      .addField(`${this.client.emojisConfig.utility} Utility`,
  `${contentUtility}`)
      .addField(`${this.client.emojisConfig.gem} Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Vote for me](${this.client.config.links.voteURL}) | [Website](${this.client.config.links.website}) | [Support Server](${this.client.config.links.supportServer})`)
      .setTimestamp()
      .setColor("BLURPLE")
      .setThumbnail(interaction.user.displayAvatarURL({ size: 1024, dynamic: true }))
      .setFooter(`Total Commands ${loadedCommands.length}`, interaction.user.displayAvatarURL({ size: 1024, dynamic: true }));
    interaction.followUp({ embeds: [cmdEmbed] });
  }
};