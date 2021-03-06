const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const Guild = require("../../models/Guild.js");

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
    let guildData = await Guild.findOne({ id: message.guild.id }, "prefix -_id");

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
              emoji: "β­"
            },{
              label: 'Member Commands',
              value: 'member_menu', 
              emoji: "π€"
            },{
              label: 'Giveaway Commands',
              value: 'gw_menu',
              emoji: "π"
            },{
              label: 'Utility Commands',
              value: 'utility_menu',
              emoji: "π"
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
        .setTitle(`πγ»Help Menu`)
        .setDescription(`Use \`${guildData.prefix}help [command]\` to view more informations about command.`)
        .addField(`${this.client.emojisConfig.members}γ»Member`, 
`View all available Member Commands`)
        .addField(`${this.client.emojisConfig.prize}γ»Giveaway`, 
`View all available Giveaway Commands`)
        .addField(`${this.client.emojisConfig.utility}γ»Utility`,
`View all available Utility Commands`)
        .addField(`${this.client.emojisConfig.vote}γ»Vote for Bot`,
`[Help Developers by Voting for Bot](${this.client.config.links.voteURL})`)
        .addField(`${this.client.emojisConfig.invite}γ»Invite Bot`,
`[Invite Bot to your Server](${this.client.config.links.inviteURL})`)
      //  .addField(`${this.client.emojisConfig.website}γ»Website`,
// `[Checkout Offical Bot Website](${this.client.config.links.website})`)
        .addField(`${this.client.emojisConfig.support}γ»Support`,
`[To get Help with Bot, join Support Server](${this.client.config.links.supportServer})`)
        .setTimestamp()
        .setColor("BLURPLE")
        .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
        .setFooter({ text: `Total Commands ${loadedCommands.length}`, iconURL: message.author.displayAvatarURL({ size: 1024, dynamic: true }) });
      let mainMenu = await message.channel.send({ embeds: [cmdEmbed], components: [helpRow] });

      let filter = (i) => i.customId == "help" && i.user.id == message.author.id;
      const collector = message.channel.createMessageComponentCollector({ filter, componentType: "SELECT_MENU", time: 300000 });

      collector.on("collect", async i => {
        if(i.values[0] == "member_menu") {
          await i.deferUpdate();
          let memberEmbed = new MessageEmbed()
            .setTitle("π€γ»Member Commands")
            .setDescription(`Use \`${guildData.prefix}help [command]\` to view more informations about command.`)
            .addField(`${this.client.emojisConfig.members}γ»Member`, `${contentMember}`)
            .addField(`${this.client.emojisConfig.gem}γ»Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Website](${this.client.config.links.website}) | [Vote for me](${this.client.config.links.voteURL}) | [Support Server](${this.client.config.links.supportServer})`)
            .setTimestamp()
            .setColor("BLURPLE")
            .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setFooter({ text: `Total Commands ${loadedCommands.length}`, iconURL: message.author.displayAvatarURL({ size: 1024, dynamic: true }) });
          mainMenu.edit({ embeds: [memberEmbed], components: [helpRow] });
        } else if(i.values[0] == "gw_menu") {
          await i.deferUpdate();
          let gwEmbed = new MessageEmbed()
            .setTitle("πγ»Giveaway Commands")
            .setDescription(`Use \`${guildData.prefix}help [command]\` to view more informations about command.`)
            .addField(`${this.client.emojisConfig.prize}γ»Giveaway`, `${contentGiveaway}`)
            .addField(`${this.client.emojisConfig.gem}γ»Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Website](${this.client.config.links.website}) | [Vote for me](${this.client.config.links.voteURL}) | [Support Server](${this.client.config.links.supportServer})`)
            .setTimestamp()
            .setColor("BLURPLE")
            .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setFooter({ text: `Total Commands ${loadedCommands.length}`, iconURL: message.author.displayAvatarURL({ size: 1024, dynamic: true }) });
          mainMenu.edit({ embeds: [gwEmbed], components: [helpRow] });
        } else if(i.values[0] == "utility_menu") {
          await i.deferUpdate();
          let utilityEmbed = new MessageEmbed()
            .setTitle("π γ»Utility Commands")
            .setDescription(`Use \`${guildData.prefix}help [command]\` to view more informations about command.`)
            .addField(`${this.client.emojisConfig.utility}γ»Utility`, `${contentUtility}`)
            .addField(`${this.client.emojisConfig.gem}γ»Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Website](${this.client.config.links.website}) | [Vote for me](${this.client.config.links.voteURL}) | [Support Server](${this.client.config.links.supportServer})`)
            .setTimestamp()
            .setColor("BLURPLE")
            .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setFooter({ text: `Total Commands ${loadedCommands.length}`, iconURL: message.author.displayAvatarURL({ size: 1024, dynamic: true }) });
          mainMenu.edit({ embeds: [utilityEmbed], components: [helpRow] });
        } else if(i.values[0] == "home_menu") {
            await i.deferUpdate();
            mainMenu.edit({ embeds: [cmdEmbed], components: [helpRow] })
        }
      });

      collector.on("end", async (m, reason) => {
        if(reason != "time") return;
        helpRow.components[0].setDisabled(true);
        mainMenu.edit({ embeds: [cmdEmbed], components: [helpRow]});
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
        .setTitle("πγ»Informations About Command")
        .setDescription(
  `> **Command** Β· \`${cmd.name}\`
> **Description** Β· \`${cmd.description}\`
> **Usage** Β· \`${guildData.prefix}${cmd.usage}\`
> **Category** Β· \`${this.client.utils.capitalizeFirstLetter(cmd.category)}\``)
        .setColor("BLURPLE")
        .setFooter({ text: this.client.config.footer, iconURL: this.client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
        .setTimestamp();
  
      message.channel.send({ embeds: [embed] });
    }
  }
  async slashRun(interaction, args) {
    let guildData = await Guild.findOne({ id: interaction.guild.id }, "prefix");

	  const helpRow = new MessageActionRow()
	    .addComponents(
	      new MessageSelectMenu()
	        .setCustomId("help")
	        .setPlaceholder("Select Category to view it's commands.")
	        .addOptions([{
              label: "Main Menu",
              value: "home_menu", 
              emoji: "β­"
            },{
              label: 'Member Commands',
              value: 'member_menu', 
              emoji: "π€"
            },{
              label: 'Giveaway Commands',
              value: 'gw_menu',
              emoji: "π"
            },{
              label: 'Utility Commands',
              value: 'utility_menu',
              emoji: "π"
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
      .setTitle(`πγ»Help Menu`)
      .setDescription(`Use \`${guildData.prefix}help [command]\` to view more informations about command.`)
      .addField(`π€γ»Member`, 
  `View all available Member Commands`)
      .addField(`πγ»Giveaway`, 
  `View all available Giveaway Commands`)
      .addField(`πγ»Utility`,
  `View all available Utility Commands`)
      .addField(`πγ»Vote for Bot`,
  `[Help Developers by Voting for Bot](${this.client.config.links.voteURL})`)
      .addField(`π³γ»Invite Bot`,
  `[Invite Bot to your Server](${this.client.config.links.inviteURL})`)
  //    .addField(`πγ»Website`,
  //`[Checkout Offical Bot Website](${this.client.config.links.website})`)
      .addField(`π­γ»Support`,
  `[To get Help with Bot, join Support Server](${this.client.config.links.supportServer})`)
      .setTimestamp()
      .setColor("BLURPLE")
      .setThumbnail(interaction.user.displayAvatarURL({ size: 1024, dynamic: true }))
      .setFooter({ text: `Total Commands ${loadedCommands.length}`, iconURL: interaction.user.displayAvatarURL({ size: 1024, dynamic: true }) });
    interaction.reply({ embeds: [cmdEmbed], components: [helpRow] });

    let filter = i => i.customId == "help" && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: "SELECT_MENU", time: 300000, errors: ["time"] });

    collector.on("collect", async i => {
      await i.deferUpdate();
      if(i.values[0] == "member_menu") {
        let memberEmbed = new MessageEmbed()
          .setTitle("π€γ»Member Commands")
          .setDescription(`Use \`${guildData.prefix}help [command]\` to view more informations about command.`)
          .addField(`π€γ»Member`, `${contentMember}`)
          .addField(`πγ»Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Website](${this.client.config.links.website}) | [Vote for me](${this.client.config.links.voteURL}) | [Support Server](${this.client.config.links.supportServer})`)
          .setTimestamp()
          .setColor("BLURPLE")
          .setThumbnail(interaction.user.displayAvatarURL({ size: 1024, dynamic: true }))
          .setFooter({ text: `Total Commands ${loadedCommands.length}`, iconURL: interaction.user.displayAvatarURL({ size: 1024, dynamic: true }) });
        interaction.editReply({ embeds: [memberEmbed], components: [helpRow] });
      } else if(i.values[0] == "gw_menu") {
        let gwEmbed = new MessageEmbed()
          .setTitle("πγ»Giveaway Commands")
          .setDescription(`Use \`${guildData.prefix}help [command]\` to view more informations about command.`)
          .addField(`πγ»Giveaway`, `${contentGiveaway}`)
          .addField(`πγ»Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Website](${this.client.config.links.website}) | [Vote for me](${this.client.config.links.voteURL}) | [Support Server](${this.client.config.links.supportServer})`)
          .setTimestamp()
          .setColor("BLURPLE")
          .setThumbnail(interaction.user.displayAvatarURL({ size: 1024, dynamic: true }))
          .setFooter({ text: `Total Commands ${loadedCommands.length}`, iconURL: interaction.user.displayAvatarURL({ size: 1024, dynamic: true }) });
        interaction.editReply({ embeds: [gwEmbed], components: [helpRow] });
      } else if(i.values[0] == "utility_menu") {
        let utilityEmbed = new MessageEmbed()
          .setTitle("πγ»Utility Commands")
          .setDescription(`Use \`${guildData.prefix}help [command]\` to view more informations about command.`)
          .addField(`πγ»Utility`, `${contentUtility}`)
          .addField(`πγ»Informations`, `[Invite Me](${this.client.config.links.inviteURL}) | [Website](${this.client.config.links.website}) | [Vote for me](${this.client.config.links.voteURL}) | [Support Server](${this.client.config.links.supportServer})`)
          .setTimestamp()
          .setColor("BLURPLE")
          .setThumbnail(interaction.user.displayAvatarURL({ size: 1024, dynamic: true }))
          .setFooter({ text: `Total Commands ${loadedCommands.length}`, iconURL: interaction.user.displayAvatarURL({ size: 1024, dynamic: true }) });
        interaction.editReply({ embeds: [utilityEmbed], components: [helpRow] });
      } else if(i.values[0] == "home_menu") {
        interaction.editReply({ embeds: [cmdEmbed], components: [helpRow] })
      }
    });

    collector.on("end", async (m, reason) => {
      if(reason != "time") return;
      helpRow.components[0].setDisabled(true);
      interaction.editReply({ embeds: [cmdEmbed], components: [helpRow]});
    });
  }
};
