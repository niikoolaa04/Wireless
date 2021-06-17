const Command = require("../../structures/Command");
const Discord = require("discord.js");
const db = require("quick.db");

module.exports = class Help extends Command {
	constructor(client) {
		super(client, {
			name: "help",
			description: "list all available commands and view informations about them",
			usage: "help [command | category]",
			permissions: [],
			category: "korisnik",
			listed: false,
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
      let loadedCommands = commandsArray.array();
      
      let contentMember = this.client.utils.commandsList(this.client, message, "member");
      let contentGiveaway = this.client.utils.commandsList(this.client, message, "giveaway");
      let contentUtility = this.client.utils.commandsList(this.client, message, "utility");
      
      let cmdEmbed = new Discord.MessageEmbed()
        .setTitle(`🚀 · Help Menu`)
        .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
        .addField(`${this.client.emojisConfig.membersE} Member`, 
`${contentMember}`)
        .addField(`${this.client.emojisConfig.prize} Giveaway`, 
`${contentGiveaway}`)
        .addField(`${this.client.emojisConfig.utility} Utility`,
`${contentUtility}`)
        .setTimestamp()
        .setColor("BLURPLE")
        .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
        .setFooter(`Total Commands ${loadedCommands.length}`, message.author.displayAvatarURL({ size: 1024, dynamic: true }));
      message.channel.send(embed);
    } else {
      let cmd = this.client.commands.get(commandArg);
      if (!cmd) return message.channel.send(embedBuilderTitle(this.client, message, `Error`
        , `You have entered invalid command/category.`, "RED"));
      if (
        cmd.category === "dev" &&
        message.author.id !== this.client.config.dev.id
      ) return message.channel.send(embedBuilderTitle(this.client, message, `Greška`
        , `You have entered command/category which doesn't exist.`, "RED"));
  
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
  
      message.channel.send(embed);
    }
  }
};