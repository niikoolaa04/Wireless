const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
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

    const helpRow = new MessageActionRow()
			.addComponents(
			  new MessageButton()
          .setCustomId("home")
          .setEmoji("⭐")
					.setLabel('Main Menu')
					.setStyle('PRIMARY'), 
				new MessageButton()
          .setCustomId("members")
          .setEmoji("👤")
					.setLabel('Members')
					.setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId("giveaway")
          .setEmoji("🎉")
					.setLabel('Giveaway')
					.setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId("utility")
          .setEmoji("🔎")
					.setLabel('Utility')
					.setStyle('PRIMARY'),
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
        .setTitle(`🚀︲Help Menu`)
        .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
        .addField(`${this.client.emojisConfig.members} Member Commands`, 
`View all available Member Commands`)
        .addField(`${this.client.emojisConfig.prize} Giveaway`, 
`View all available Giveaway Commands`)
        .addField(`${this.client.emojisConfig.utility} Utility`,
`View all available Utility Commands`)
        .addField(`${this.client.emojisConfig.vote} Vote for Bot`,
`[Help Developers by Voting for Bot](${this.client.config.links.voteURL})`)
        .addField(`${this.client.emojisConfig.invite} Invite Bot`,
`[Invite Bot to your Server](${this.client.config.links.inviteURL})`)
        .addField(`${this.client.emojisConfig.website} Website`,
`[Checkout Offical Bot Website](${this.client.config.links.website})`)
        .setTimestamp()
        .setColor("BLURPLE")
        .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
        .setFooter(`Total Commands ${loadedCommands.length}`, message.author.displayAvatarURL({ size: 1024, dynamic: true }));
      let mainMenu = await message.channel.send({ embeds: [cmdEmbed], components: [helpRow] });

      let filter = m => m.user.id === message.author.id;
      const collector = message.channel.createMessageComponentCollector({ filter, time: 120000, errors: ["time"] });

      collector.on("collect", async i => {
        if(i.customId == "members") {
          await i.deferUpdate();
          let memberEmbed = new MessageEmbed()
            .setTitle("👤︲Member Commands")
            .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
            .addField(`${this.client.emojisConfig.members} Member`, `${contentMember}`)
            .addField(`${this.client.emojisConfig.gem} Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Vote for me](${this.client.config.links.voteURL}) | [Website](${this.client.config.links.website}) | [Support Server](${this.client.config.links.supportServer})`)
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setFooter(`Total Commands ${loadedCommands.length}`, message.author.displayAvatarURL({ size: 1024, dynamic: true }));
          mainMenu.edit({ embeds: [memberEmbed], components: [helpRow] });
        } else if(i.customId == "giveaway") {
          await i.deferUpdate();
          let gwEmbed = new MessageEmbed()
            .setTitle("🎁︲Giveaways Commands")
            .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
            .addField(`${this.client.emojisConfig.prize} Giveaway`, `${contentGiveaway}`)
            .addField(`${this.client.emojisConfig.gem} Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Vote for me](${this.client.config.links.voteURL}) | [Website](${this.client.config.links.website}) | [Support Server](${this.client.config.links.supportServer})`)
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setFooter(`Total Commands ${loadedCommands.length}`, message.author.displayAvatarURL({ size: 1024, dynamic: true }));
          mainMenu.edit({ embeds: [gwEmbed], components: [helpRow] });
        } else if(i.customId == "utility") {
          await i.deferUpdate();
          let utilityEmbed = new MessageEmbed()
            .setTitle("🛠︲Utility Commands")
            .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
            .addField(`${this.client.emojisConfig.utility} Utility`, `${contentUtility}`)
            .addField(`${this.client.emojisConfig.gem} Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Vote for me](${this.client.config.links.voteURL}) | [Website](${this.client.config.links.website}) | [Support Server](${this.client.config.links.supportServer})`)
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setFooter(`Total Commands ${loadedCommands.length}`, message.author.displayAvatarURL({ size: 1024, dynamic: true }));
          mainMenu.edit({ embeds: [utilityEmbed], components: [helpRow] });
        } else if(i.customId == "home") {
            await i.deferUpdate();
            mainMenu.edit({ embeds: [cmdEmbed], components: [helpRow] })
        }
      });
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
    
    const helpRow = new MessageActionRow()
			.addComponents(
			  new MessageButton()
			    .setCustomId("home")
			    .setEmoji("⭐")
			    .setLabel('Main Menu')
			    .setStyle('PRIMARY'),
				new MessageButton()
          .setCustomId("members")
          .setEmoji("👤")
					.setLabel('Members')
					.setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId("giveaway")
          .setEmoji("🎉")
					.setLabel('Giveaway')
					.setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId("utility")
          .setEmoji("🔎")
					.setLabel('Utility')
					.setStyle('PRIMARY'),
			); 

    let commandsArray = this.client.commands.filter(
      c => c.listed === true
    );
    let loadedCommands = [...commandsArray.values()];
    
    let contentMember = this.client.utils.commandsList(this.client, interaction, "member");
    let contentGiveaway = this.client.utils.commandsList(this.client, interaction, "giveaway");
    let contentUtility = this.client.utils.commandsList(this.client, interaction, "utility");
    
    let cmdEmbed = new MessageEmbed()
      .setTitle(`🚀︲Help Menu`)
      .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
      .addField(`👤 Member Commands`, 
  `View all available Member Commands`)
      .addField(`🎉 Giveaway`, 
  `View all available Giveaway Commands`)
      .addField(`🛠 Utility`,
  `View all available Utility Commands`)
      .addField(`🔝 Vote for Bot`,
  `[Help Developers by Voting for Bot](${this.client.config.links.voteURL})`)
      .addField(`➕ Invite Bot`,
  `[Invite Bot to your Server](${this.client.config.links.inviteURL})`)
      .addField(`🌐 Website`,
  `[Checkout Offical Bot Website](${this.client.config.links.website})`)
      .setTimestamp()
      .setColor("BLURPLE")
      .setThumbnail(interaction.user.displayAvatarURL({ size: 1024, dynamic: true }))
      .setFooter(`Total Commands ${loadedCommands.length}`, interaction.user.displayAvatarURL({ size: 1024, dynamic: true }));
    interaction.followUp({ embeds: [cmdEmbed], components: [helpRow] });

    let filter = m => m.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000, errors: ["time"] });

    collector.on("collect", async i => {
      if(i.customId == "members") {
        //await i.deferUpdate();
        let memberEmbed = new MessageEmbed()
          .setTitle("👤︲Member Commands")
          .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
          .addField(`👤 Member`, `${contentMember}`)
          .addField(`💎 Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Vote for me](${this.client.config.links.voteURL}) | [Website](${this.client.config.links.website}) | [Support Server](${this.client.config.links.supportServer})`)
          .setTimestamp()
          .setThumbnail(interaction.user.displayAvatarURL({ size: 1024, dynamic: true }))
          .setFooter(`Total Commands ${loadedCommands.length}`, interaction.user.displayAvatarURL({ size: 1024, dynamic: true }));
        await i.update({ embeds: [memberEmbed], components: [helpRow] });
      } else if(i.customId == "giveaway") {
        //await i.deferUpdate();
        let gwEmbed = new MessageEmbed()
          .setTitle("🎁︲Giveaway Commands")
          .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
          .addField(`🎉 Giveaway`, `${contentGiveaway}`)
          .addField(`💎 Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Vote for me](${this.client.config.links.voteURL}) | [Website](${this.client.config.links.website}) | [Support Server](${this.client.config.links.supportServer})`)
          .setTimestamp()
          .setThumbnail(interaction.user.displayAvatarURL({ size: 1024, dynamic: true }))
          .setFooter(`Total Commands ${loadedCommands.length}`, interaction.user.displayAvatarURL({ size: 1024, dynamic: true }));
        await i.update({ embeds: [gwEmbed], components: [helpRow] });
      } else if(i.customId == "utility") {
        //await i.deferUpdate(); 
        let utilityEmbed = new MessageEmbed()
          .setTitle("🛠︲Utility Commands")
          .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
          .addField(`🔨 Utility`, `${contentUtility}`)
          .addField(`💎 Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Vote for me](${this.client.config.links.voteURL}) | [Website](${this.client.config.links.website}) | [Support Server](${this.client.config.links.supportServer})`)
          .setTimestamp()
          .setThumbnail(interaction.user.displayAvatarURL({ size: 1024, dynamic: true }))
          .setFooter(`Total Commands ${loadedCommands.length}`, interaction.user.displayAvatarURL({ size: 1024, dynamic: true }));
        await i.update({ embeds: [utilityEmbed], components: [helpRow] });
      } else if(i.customId == "home") {
        //await i.deferUpdate();
        await i.update({ embeds: [cmdEmbed], components: [helpRow] })
      }
    })
  }
};