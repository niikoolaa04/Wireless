const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
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
	      new MessageSelectMenu()
	        .setCustomId("help")
	        .setPlaceholder("Select Category to view it's commands.")
	        .addOptions([{
              label: "Main Menu",
              value: "home_menu", 
              emoji: "⭐"
            },{
              label: 'Member Commands',
              value: 'member_menu', 
              emoji: "👤"
            },{
              label: 'Giveaway Commands',
              value: 'gw_menu',
              emoji: "🎉"
            },{
              label: 'Utility Commands',
              value: 'utility_menu',
              emoji: "🔎"
            },
          ]),
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
        .setTitle(`🚀・Help Menu`)
        .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
        .addField(`${this.client.emojisConfig.members}・Member`, 
`View all available Member Commands`)
        .addField(`${this.client.emojisConfig.prize}・Giveaway`, 
`View all available Giveaway Commands`)
        .addField(`${this.client.emojisConfig.utility}・Utility`,
`View all available Utility Commands`)
        .addField(`${this.client.emojisConfig.vote}・Vote for Bot`,
`[Help Developers by Voting for Bot](${this.client.config.links.voteURL})`)
        .addField(`${this.client.emojisConfig.invite}・Invite Bot`,
`[Invite Bot to your Server](${this.client.config.links.inviteURL})`)
        .addField(`${this.client.emojisConfig.website}・Website`,
`[Checkout Offical Bot Website](${this.client.config.links.website})`)
        .addField(`${this.client.emojisConfig.support}・Support`,
`[To get Help with Bot, join Support Server](${this.client.config.links.supportServer})`)
        .setTimestamp()
        .setColor("BLURPLE")
        .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
        .setFooter(`Total Commands ${loadedCommands.length}`, message.author.displayAvatarURL({ size: 1024, dynamic: true }));
      let mainMenu = await message.channel.send({ embeds: [cmdEmbed], components: [helpRow] });

      let filter = (i) => i.customId == "help" && i.user.id == message.author.id;
      const collector = message.channel.createMessageComponentCollector({ filter, componentType: "SELECT_MENU", time: 300000 });

      collector.on("collect", async i => {
        if(i.values[0] == "member_menu") {
          await i.deferUpdate();
          let memberEmbed = new MessageEmbed()
            .setTitle("👤・Member Commands")
            .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
            .addField(`${this.client.emojisConfig.members}・Member`, `${contentMember}`)
            .addField(`${this.client.emojisConfig.gem}・Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Vote for me](${this.client.config.links.voteURL}) | [Website](${this.client.config.links.website}) | [Support Server](${this.client.config.links.supportServer})`)
            .setTimestamp()
            .setColor("BLURPLE")
            .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setFooter(`Total Commands ${loadedCommands.length}`, message.author.displayAvatarURL({ size: 1024, dynamic: true }));
          mainMenu.edit({ embeds: [memberEmbed], components: [helpRow] });
        } else if(i.values[0] == "gw_menu") {
          await i.deferUpdate();
          let gwEmbed = new MessageEmbed()
            .setTitle("🎁・Giveaway Commands")
            .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
            .addField(`${this.client.emojisConfig.prize}・Giveaway`, `${contentGiveaway}`)
            .addField(`${this.client.emojisConfig.gem}・Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Vote for me](${this.client.config.links.voteURL}) | [Website](${this.client.config.links.website}) | [Support Server](${this.client.config.links.supportServer})`)
            .setTimestamp()
            .setColor("BLURPLE")
            .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setFooter(`Total Commands ${loadedCommands.length}`, message.author.displayAvatarURL({ size: 1024, dynamic: true }));
          mainMenu.edit({ embeds: [gwEmbed], components: [helpRow] });
        } else if(i.values[0] == "utility_menu") {
          await i.deferUpdate();
          let utilityEmbed = new MessageEmbed()
            .setTitle("🛠・Utility Commands")
            .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
            .addField(`${this.client.emojisConfig.utility}・Utility`, `${contentUtility}`)
            .addField(`${this.client.emojisConfig.gem}・Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Vote for me](${this.client.config.links.voteURL}) | [Website](${this.client.config.links.website}) | [Support Server](${this.client.config.links.supportServer})`)
            .setTimestamp()
            .setColor("BLURPLE")
            .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setFooter(`Total Commands ${loadedCommands.length}`, message.author.displayAvatarURL({ size: 1024, dynamic: true }));
          mainMenu.edit({ embeds: [utilityEmbed], components: [helpRow] });
        } else if(i.values[0] == "home_menu") {
            await i.deferUpdate();
            mainMenu.edit({ embeds: [cmdEmbed], components: [helpRow] })
        }
      });

      collector.on("end", async (m, reason) => {
        if(reason != "time") return;
        const disabledRow = new MessageActionRow()
    	    .addComponents(
    	      new MessageSelectMenu()
    	        .setCustomId("help")
    	        .setDisabled(true)
    	        .setPlaceholder("Select Category to view it's commands.")
    	        .addOptions([{
                  label: "Main Menu",
                  value: "home_menu", 
                  emoji: "⭐"
                },{
                  label: 'Member',
                  value: 'member_menu', 
                  emoji: "👤"
                },{
                  label: 'Giveaway',
                  value: 'gw_menu',
                  emoji: "🎉"
                },{
                  label: 'Utility',
                  value: 'utility_menu',
                  emoji: "🔎"
                },
              ]),
    	    );
        
        mainMenu.edit({ embeds: [cmdEmbed], components: [disabledRow]});
      });
    } else {
      let cmd = this.client.commands.get(commandArg);
      if (!cmd) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Error`
        , `You have entered invalid command/category.`, "RED") ]});
      if (
        cmd.category === "dev" &&
        message.author.id !== this.client.config.developer.id
      ) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Error`
        , `You have entered command/category which doesn't exist.`, "RED") ]});
  
      let embed = new MessageEmbed()
        .setTitle("🚀・Informations About Command")
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
	      new MessageSelectMenu()
	        .setCustomId("help")
	        .setPlaceholder("Select Category to view it's commands.")
	        .addOptions([{
              label: "Main Menu",
              value: "home_menu", 
              emoji: "⭐"
            },{
              label: 'Member Commands',
              value: 'member_menu', 
              emoji: "👤"
            },{
              label: 'Giveaway Commands',
              value: 'gw_menu',
              emoji: "🎉"
            },{
              label: 'Utility Commands',
              value: 'utility_menu',
              emoji: "🔎"
            },
          ]),
	    );

    let commandsArray = this.client.commands.filter(
      c => c.listed === true
    );
    let loadedCommands = [...commandsArray.values()];
    
    let contentMember = this.client.utils.commandsList(this.client, interaction, "member");
    let contentGiveaway = this.client.utils.commandsList(this.client, interaction, "giveaway");
    let contentUtility = this.client.utils.commandsList(this.client, interaction, "utility");
    
    let cmdEmbed = new MessageEmbed()
      .setTitle(`🚀・Help Menu`)
      .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
      .addField(`👤・Member`, 
  `View all available Member Commands`)
      .addField(`🎉・Giveaway`, 
  `View all available Giveaway Commands`)
      .addField(`🔎・Utility`,
  `View all available Utility Commands`)
      .addField(`🆙・Vote for Bot`,
  `[Help Developers by Voting for Bot](${this.client.config.links.voteURL})`)
      .addField(`💳・Invite Bot`,
  `[Invite Bot to your Server](${this.client.config.links.inviteURL})`)
      .addField(`🌐・Website`,
  `[Checkout Offical Bot Website](${this.client.config.links.website})`)
      .addField(`🎭・Support`,
  `[To get Help with Bot, join Support Server](${this.client.config.links.supportServer})`)
      .setTimestamp()
      .setColor("BLURPLE")
      .setThumbnail(interaction.user.displayAvatarURL({ size: 1024, dynamic: true }))
      .setFooter(`Total Commands ${loadedCommands.length}`, interaction.user.displayAvatarURL({ size: 1024, dynamic: true }));
    interaction.followUp({ embeds: [cmdEmbed], components: [helpRow] });

    let filter = i => i.customId == "help" && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: "SELECT_MENU", time: 300000, errors: ["time"] });

    collector.on("collect", async i => {
      if(i.values[0] == "member_menu") {
        let memberEmbed = new MessageEmbed()
          .setTitle("👤・Member Commands")
          .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
          .addField(`👤・Member`, `${contentMember}`)
          .addField(`💎・Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Vote for me](${this.client.config.links.voteURL}) | [Website](${this.client.config.links.website}) | [Support Server](${this.client.config.links.supportServer})`)
          .setTimestamp()
          .setColor("BLURPLE")
          .setThumbnail(interaction.user.displayAvatarURL({ size: 1024, dynamic: true }))
          .setFooter(`Total Commands ${loadedCommands.length}`, interaction.user.displayAvatarURL({ size: 1024, dynamic: true }));
        i.update({ embeds: [memberEmbed], components: [helpRow] });
      } else if(i.values[0] == "gw_menu") {
        let gwEmbed = new MessageEmbed()
          .setTitle("🎁・Giveaway Commands")
          .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
          .addField(`🎉・Giveaway`, `${contentGiveaway}`)
          .addField(`💎・Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Vote for me](${this.client.config.links.voteURL}) | [Website](${this.client.config.links.website}) | [Support Server](${this.client.config.links.supportServer})`)
          .setTimestamp()
          .setColor("BLURPLE")
          .setThumbnail(interaction.user.displayAvatarURL({ size: 1024, dynamic: true }))
          .setFooter(`Total Commands ${loadedCommands.length}`, interaction.user.displayAvatarURL({ size: 1024, dynamic: true }));
        i.update({ embeds: [gwEmbed], components: [helpRow] });
      } else if(i.values[0] == "utility_menu") {
        let utilityEmbed = new MessageEmbed()
          .setTitle("🔎・Utility Commands")
          .setDescription(`Use \`${prefix}help [command]\` to view more informations about command.`)
          .addField(`🔎・Utility`, `${contentUtility}`)
          .addField(`💎・Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Vote for me](${this.client.config.links.voteURL}) | [Website](${this.client.config.links.website}) | [Support Server](${this.client.config.links.supportServer})`)
          .setTimestamp()
          .setColor("BLURPLE")
          .setThumbnail(interaction.user.displayAvatarURL({ size: 1024, dynamic: true }))
          .setFooter(`Total Commands ${loadedCommands.length}`, interaction.user.displayAvatarURL({ size: 1024, dynamic: true }));
        i.update({ embeds: [utilityEmbed], components: [helpRow] });
      } else if(i.values[0] == "home_menu") {
        i.update({ embeds: [cmdEmbed], components: [helpRow] })
      }
    });

    collector.on("end", async (m, reason) => {
      if(reason != "time") return;
      const disabledRow = new MessageActionRow()
  	    .addComponents(
  	      new MessageSelectMenu()
  	        .setCustomId("help")
  	        .setDisabled(true)
  	        .setPlaceholder("Select Category to view it's commands.")
  	        .addOptions([{
                label: "Main Menu",
                value: "home_menu", 
                emoji: "⭐"
              },{
                label: 'Member',
                value: 'member_menu', 
                emoji: "👤"
              },{
                label: 'Giveaway',
                value: 'gw_menu',
                emoji: "🎉"
              },{
                label: 'Utility',
                value: 'utility_menu',
                emoji: "🔎"
              },
            ]),
  	    );
      
      interaction.editReply({ embeds: [cmdEmbed], components: [disabledRow]});
    });
  }
};