const Command = require("../../structures/Command");
const { MessageEmbed, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
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
    
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
          .setURL(this.client.config.links.inviteSite)
					.setLabel('Invite Me')
					.setStyle('LINK'),
        new MessageButton()
          .setURL(this.client.config.links.voteURL)
					.setLabel('Vote for Me')
					.setStyle('LINK'),
        new MessageButton()
          .setURL(this.client.config.links.website)
					.setLabel('Website')
					.setStyle('LINK'),
        new MessageButton()
          .setURL(this.client.config.links.supportServer)
					.setLabel('Support Server')
					.setStyle('LINK')
			);

    if(!commandArg) {
      let commandsArray = this.client.commands.filter(
          c => c.listed === true
        );
      let loadedCommands = [...commandsArray.values()];
      
      let contentMember = this.client.utils.commandsList(this.client, message, "member");
      let contentGiveaway = this.client.utils.commandsList(this.client, message, "giveaway");
      let contentUtility = this.client.utils.commandsList(this.client, message, "utility");
      
      let cmdEmbed = new MessageEmbed()
        .setTitle(`🚀 · Help Menu`)
        .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
        .addField(`${this.client.emojisConfig.members} Member`, 
`${contentMember}`)
        .addField(`${this.client.emojisConfig.prize} Giveaway`, 
`${contentGiveaway}`)
        .addField(`${this.client.emojisConfig.utility} Utility`,
`${contentUtility}`)
        .setTimestamp()
        .setColor("BLURPLE")
        .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
        .setFooter(`Total Commands ${loadedCommands.length}`, message.author.displayAvatarURL({ size: 1024, dynamic: true }));
      message.channel.send({ embeds: [cmdEmbed], components: [row] });
    } else {
      let cmd = this.client.commands.get(commandArg);
      if (!cmd) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, `Error`
        , `You have entered invalid command/category.`, "RED") ]});
      if (
        cmd.category === "dev" &&
        message.author.id !== this.client.config.developer.id
      ) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, `Error`
        , `You have entered command/category which doesn't exist.`, "RED") ]});
  
      let embed = new MessageEmbed()
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
    
    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
          .setURL(this.client.config.links.inviteSite)
					.setLabel('Invite Me')
					.setStyle('LINK'),
        new MessageButton()
          .setURL(this.client.config.links.voteURL)
					.setLabel('Vote for Me')
					.setStyle('LINK'),
        new MessageButton()
          .setURL(this.client.config.links.website)
					.setLabel('Website')
					.setStyle('LINK'),
        new MessageButton()
          .setURL(this.client.config.links.supportServer)
					.setLabel('Support Server')
					.setStyle('LINK')
			);

    let commandsArray = this.client.commands.filter(
      c => c.listed === true
    );
    let loadedCommands = [...commandsArray.values()];
    
    let contentMember = this.client.utils.commandsList(this.client, interaction, "member");
    let contentGiveaway = this.client.utils.commandsList(this.client, interaction, "giveaway");
    let contentUtility = this.client.utils.commandsList(this.client, interaction, "utility");
    
    let cmdEmbed = new MessageEmbed()
      .setTitle(`🚀 · Help Menu`)
      .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
      .addField(`👤 Member`, 
  `${contentMember}`)
      .addField(`🎁 Giveaway`, 
  `${contentGiveaway}`)
      .addField(`🛠 Utility`,
  `${contentUtility}`)
      .setTimestamp()
      .setColor("BLURPLE")
      .setThumbnail(interaction.user.displayAvatarURL({ size: 1024, dynamic: true }))
      .setFooter(`Total Commands ${loadedCommands.length}`, interaction.user.displayAvatarURL({ size: 1024, dynamic: true }));
    interaction.followUp({ embeds: [cmdEmbed], components: [row] });
  }
};