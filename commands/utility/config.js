const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Guild = require("../../models/Guild.js");
const { parse } = require("twemoji-parser");

module.exports = class Config extends Command {
	constructor(client) {
		super(client, {
			name: "config",
			description: "Edit Bot Configuration",
			usage: "config [Option] [Value]",
			permissions: ["ADMINISTRATOR"],
			category: "utility",
			listed: true,
			slash: true, 
      options: [{
        name: 'list',
        type: 'SUB_COMMAND',
        description: "List of config options",
      },{
        name: 'bypassrole',
        type: 'SUB_COMMAND',
        description: "Giveaway Bypass Role",
        options: [{
          name: 'byrole', 
          type: 'ROLE', 
          description: "Giveaway Bypass Role", 
          required: false,
        }]
      },{
        name: 'blacklistrole',
        type: 'SUB_COMMAND',
        description: "Giveaway Blacklist Role",
        options: [{
          name: 'blrole', 
          type: 'ROLE', 
          description: "Giveaway Blacklist Role", 
          required: false,
        }]
      },{
        name: 'inviteschannel',
        type: 'SUB_COMMAND',
        description: "Invites Channel",
        options: [{
          name: 'invchannel',
          type: 'CHANNEL',
          description: "Invites Channel", 
          required: false,
        }]
      },{
        name: 'joinmessage',
        type: 'SUB_COMMAND',
        description: "Invites Join Message",
        options: [{
          name: 'joinmsg',
          type: 'STRING',
          description: "Invites Join Message", 
          required: true,
        }]
      },{
        name: 'leavemessage',
        type: 'SUB_COMMAND',
        description: "Invites Leave Message",
        options: [{
          name: 'leavemsg',
          type: 'STRING',
          description: "Invites Leave Message", 
          required: true,
        }]
      },{
        name: 'dmwinners',
        type: 'SUB_COMMAND',
        description: "Enable/Disable DM Winners",
      },{
        name: 'snipes',
        type: 'SUB_COMMAND',
        description: "Enable/Disable Snipes",
      },{
        name: 'wlcmimg',
        type: 'SUB_COMMAND',
        description: "Welcome Image",
      },{
        name: 'imgchannel',
        type: 'SUB_COMMAND',
        description: "Welcome Image Channel", 
        options: [{
          name: 'imagechannel', 
          type: 'CHANNEL', 
          description: "Welcome Image Channel", 
          required: true, 
        }]
      },{
        name: 'reaction',
        type: 'SUB_COMMAND',
        description: "Custom GW Reaction Emoji",
        options: [{
          name: 'customemoji',
          type: 'STRING',
          description: "Custom GW Reaction Emoji",
          required: true
        }]
      }]
		});
	}
  
  async run(message, args) {
    let option = args[0];
    let settings = await Guild.findOne({ id: message.guild.id });
    let premiumGuild = settings.premium;
    
    if(!option || option > 11 || option < 1) {
      let noOption = new Discord.MessageEmbed()
        .setAuthor({ name: "Configuration", iconURL: this.client.user.displayAvatarURL() })
        .setDescription(`To Change Config Value do \`${settings.prefix}config [Option] [Value]\``)
        .addField(`🌙 - Bypass Role (1)`, settings.bypassRole ? `<@${settings.bypassRole}>` : 'No Role')
        .addField(`❌ - Blacklist Role (2)`, settings.blacklistRole ? `<@${settings.blacklistRole}>` : 'No Role')
        .addField(`🎫 - Invites Channel (3)`, settings.invitesChannel ? `<#${setting.invitesChannel}>` : 'No Channel')
        .addField(`🚪 - Join Message (4)`, settings.joinMessage ? `\`${settings.joinMessage}\`` : '`No Join Message Setuped`')
        .addField(`✨ - Leave Message (5)`, settings.leaveMessage ? `\`${settings.leaveMessage}\`` : '`No Leave Message Setuped`')
        .addField(`💬 - DM Winners (6)`, settings.dmWinners ? `Yes` : 'No')
        .addField(`🔎 - Snipes (7)`, settings.snipes ? `Yes` : 'No')
        .addField(`👋 - Welcome Image (8)`, settings.wlcmImage ? `Yes` : 'No')
        .addField(`📞 - Welcome Channel for Image (9)`, settings.wlcmChannel ? `<#${settings.welcomeChannel}>` : 'No Channel')
        .addField(`💥 - Custom GW Reaction (10)`, `${settings.customEmoji}`)
        .setColor("BLURPLE")
        .setThumbnail(this.client.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

      message.channel.send({ embeds:  [noOption] });
    }

    if(option == 1) {
      let role = message.mentions.roles.first();
      let gwRole = settings.bypassRole;
       
      if(!gwRole) {
        if (!role) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Error`, "You haven't mentioned role.", "RED") ]});

        await Guild.findOneAndUpdate({ id: message.guild.id }, { bypassRole : `${role.id}` }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, `Giveaway Requirements Bypass Role have been successfully changed to \`${role}\`.`, "YELLOW") ]});
      } else {
        await Guild.findOneAndUpdate({ id: message.guild.id }, { bypassRole: null }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
        `Config`, "You have successfully reseted Bypass Role.", "RED") ]});
      }
    }
    if(option == 2) {
      let role = message.mentions.roles.first();
      let gwRole = settings.blacklistRole;

      if(!gwRole) {
        if (!role) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Error`, "You haven't mentioned role.", "RED") ]});
    
        await Guild.findOneAndUpdate({ id: message.guild.id }, { blacklistRole : `${role.id}` }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, `Giveaway Requirements Blacklist Role have been successfully changed to \`${role}\`.`, "YELLOW") ]});
      } else {
        await Guild.findOneAndUpdate({ id: message.guild.id }, { blacklistRole : null }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "You have successfully reseted Blacklist Role.", "RED") ]});
      }
    }
    if(option == 3) {
      let channel = message.mentions.channels.first();
      if (!channel) {
        await Guild.findOneAndUpdate({ id: message.guild.id }, { invitesChannel: null }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, `Invites Channel have been rested.`, "RED") ]});
      }
      if (channel) {
        await Guild.findOneAndUpdate({ id: message.guild.id }, { invitesChannel: `${channel.id}` }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, `Invites Channel has been set to ${channel}.
To reset it just use command without arguments.`, "YELLOW") ]});
      }
    }
    if(option == 4) {
      if(!args[1]) return message.channel.send(
        { embeds: [this.client.embedBuilder(this.client, message.author, "Error", "You need to enter join message or in order to clear it just type 'none'", "RED") ]}
      );
      if (args[1].toLowerCase() == "none") {
        await Guild.findOneAndUpdate({ id: message.guild.id }, { joinMessage: null }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "Join Message have been reseted.", "RED") ]});
      }
      if (args[1] && args[1].toLowerCase() != "none") {
        let content = args.slice(1).join(" ");
        await Guild.findOneAndUpdate({ id: message.guild.id }, { joinMessage: `${content}` }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, `You have Changed Message which is sent to invites logging channel when member joins server.
To clear Message just use "none".
Use \`variables\` Command to view all available Variables.`, "YELLOW") ]});
      }
    }
    if(option == 5) {
      if(!args[1]) return message.channel.send(
        { embeds: [this.client.embedBuilder(this.client, message.author, "Error", "You need to enter leave message or in order to clear it just type 'none'", "RED")] }
      );
      if (args[1].toLowerCase() == "none") {
        await Guild.findOneAndUpdate({ id: message.guild.id }, { leaveMessage: null }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "Leave Message have been reseted.", "RED") ]});
      }
      if (args[1] && args[1].toLowerCase() != "none") {
        let content = args.slice(1).join(" ");
        await Guild.findOneAndUpdate({ id: message.guild.id }, { leaveMessage: `${content}` }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, `You have Changed Message which is sent to invites logging channel when member leave server.
To clear Message just use "none".
Use \`variables\` Command to view all available Variables.`, "YELLOW") ]});
      }
    }
    if(option == 6) {
      let dm = settings.dmWinners;
      if(dm == null) {
        await Guild.findOneAndUpdate({ id: message.guild.id }, { dmWinners: true }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "You have Enabled DM Winners Option.", "YELLOW") ]});
      } else {
        await Guild.findOneAndUpdate({ id: message.guild.id }, { dmWinners: null }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "You have Disabled DM Winners Option.", "RED") ]});
      }
    }
    if(option == 7) {
      let snStatus = settings.snipes;
      if(snStatus == null) {
        await Guild.findOneAndUpdate({ id: message.guild.id }, { snipes: true }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "You have Enabled Snipes Option.", "YELLOW") ]});
      } else {
        await Guild.findOneAndUpdate({ id: message.guild.id }, { snipes: null }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "You have Disabled Snipes Option.", "RED") ]});
      }
    }
    if(option == 8) {
      let img = settings.wlcmImage;
      if(img == null) {
        await Guild.findOneAndUpdate({ id: message.guild.id }, { wlcmImage: true }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "You have Enabled Welcome Image Option.", "YELLOW") ]});
      } else {
        await Guild.findOneAndUpdate({ id: message.guild.id }, { wlcmImage: null }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "You have Disabled Welcome Image Option.", "RED") ]});
      }
    }
    if(option == 9) {
      let channel = message.mentions.channels.first();
      if (!channel) {
        await Guild.findOneAndUpdate({ id: message.guild.id }, { welcomeChannel: null }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, `Welcome Channel have been rested.`, "RED") ]});
      }
      if (channel) {
        await Guild.findOneAndUpdate({ id: message.guild.id }, { welcomeChannel: `${channel.id}` }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, `Welcome Channel has been set to ${channel}.
To reset it just use command without arguments.`, "YELLOW") ]});
      }
    }
    if(option == 10) {
      if(premiumGuild != true) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
        `Error`, `This option is only available for Premium Guilds, use command \`premium\` to get more informations.`, "YELLOW") ]});
      if(!args[1]) return message.channel.send(
        { embeds: [this.client.embedBuilder(this.client, message.author, "Error", "You need to enter emoji.", "RED")] }
      );
      if (!parse(args[1])[0]) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Error`, "You have entered invalid emoji (Custom Emojis are not supported).", "RED") ]});
      if (parse(args[1])[0]) {
        await Guild.findOneAndUpdate({ id: message.guild.id }, { customEmoji: `${parse(args[1])[0].text}` }, { new: true, upsert: true });
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, `You have Changed Giveaway Reaction Emoji to ${parse(args[1])[0].text}.

❗ **If you have any running giveaways, users will no longer be able to enter them because of new Reaction Emoji
but users who are already participating won't be affected** ❗`, "YELLOW") ]});
      }
    }
  }
  async slashRun(interaction, args) {
    let option = args[0];
    let value = args[1];
    let settings = await Guild.findOne({ id: interaction.guild.id });
    
    let premiumGuild = settings.premium;
    
    if(option == "list") {
      let noOption = new Discord.MessageEmbed()
        .setAuthor({ name: "Configuration", iconURL: this.client.user.displayAvatarURL() })
        .setDescription(`To Change Config Value do \`${settings.prefix}config [Option] [Value]\``)
        .addField(`🌙 - Bypass Role (1)`, settings.bypassRole ? `<@${settings.bypassRole}>` : 'No Role')
        .addField(`❌ - Blacklist Role (2)`, settings.blacklistRole ? `<@${settings.blacklistRole}>` : 'No Role')
        .addField(`🎫 - Invites Channel (3)`, settings.invitesChannel ? `<#${setting.invitesChannel}>` : 'No Channel')
        .addField(`🚪 - Join Message (4)`, settings.joinMessage ? `\`${settings.joinMessage}\`` : '`No Join Message Setuped`')
        .addField(`✨ - Leave Message (5)`, settings.leaveMessage ? `\`${settings.leaveMessage}\`` : '`No Leave Message Setuped`')
        .addField(`💬 - DM Winners (6)`, settings.dmWinners ? `Yes` : 'No')
        .addField(`🔎 - Snipes (7)`, settings.snipes ? `Yes` : 'No')
        .addField(`👋 - Welcome Image (8)`, settings.wlcmImage ? `Yes` : 'No')
        .addField(`📞 - Welcome Channel for Image (9)`, settings.wlcmChannel ? `<#${settings.welcomeChannel}>` : 'No Channel')
        .addField(`💥 - Custom GW Reaction (10)`, `${settings.customEmoji}`)
        .setColor("BLURPLE")
        .setThumbnail(this.client.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

      interaction.reply({ embeds:  [noOption], ephemeral: true });
    }

    if(option == "bypassrole") {
      let gwRole = settings.bypassRole;
      let role = interaction.guild.roles.cache.get(value); 
       
      if(!gwRole) {
        if (!value) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Error`, "You haven't mentioned role.", "RED")], ephemeral: true });

        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { bypassRole: `${role.id}` }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, `Giveaway Requirements Bypass Role have been successfully changed to \`${role}\`.`, "YELLOW") ]});
      } else {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { bypassRole: null }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
        `Config`, "You have successfully reseted Bypass Role.", "RED") ]});
      }
    }
    if(option == "blacklistrole") {
      let role = interaction.guild.roles.cache.get(value);
      let gwRole = settings.blacklistRole;

      if(!gwRole) {
        if (!value) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Error`, "You haven't mentioned role.", "RED")], ephemeral: true });
        
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { blacklistRole: `${role.id}` }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, `Giveaway Requirements Blacklist Role have been successfully changed to \`${role}\`.`, "YELLOW") ]});
      } else {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { blacklistRole: null }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "You have successfully reseted Blacklist Role.", "RED") ]});
      }
    }
    if(option == "inviteschannel") {
      let channel = interaction.guild.channels.cache.get(value);
      if (!value) {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { invitesChannel: null }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, `Invites Channel have been rested.`, "RED") ]});
      }
      if (value) {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { invitesChannel: `${channel.id}` }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, `Invites Channel has been set to ${channel}.
To reset it just use command without arguments.`, "YELLOW") ]});
      }
    }
    if(option == "joinmessage") {
      if(!args[1]) return interaction.reply(
        { embeds: [this.client.embedBuilder(this.client, interaction.user, "Error", "You need to enter join message or in order to clear it just type 'none'", "RED")], ephemeral: true }
      );
      if (args[1].toLowerCase() == "none") {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { joinMessage: null }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "Join Message have been reseted.", "RED") ]});
      }
      if (args[1] && args[1].toLowerCase() != "none") {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { invitesChannel: `${value}` }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, `You have Changed Message which is sent to invites logging channel when member joins server.
To clear Message just use "none".
Use \`variables\` Command to view all available Variables.`, "YELLOW") ]});
      }
    }
    if(option == "leavemessage") {
      if(!args[1]) return interaction.reply(
        { embeds: [this.client.embedBuilder(this.client, interaction.user, "Error", "You need to enter leave message or in order to clear it just type 'none'", "RED")] , ephemeral: true }
      );
      if (args[1].toLowerCase() == "none") {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { leaveMessage: null }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "Leave Message have been reseted.", "RED") ]});
      }
      if (args[1] && args[1].toLowerCase() != "none") {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { leaveMessage: value }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, `You have Changed Message which is sent to invites logging channel when member leave server.
To clear Message just use "none".
Use \`variables\` Command to view all available Variables.`, "YELLOW") ]});
      }
    }
    if(option == "dmwinners") {
      let dm = settings.dmWinners;
      if(dm == null) {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { dmWinners: true }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "You have Enabled DM Winners Option.", "YELLOW") ]});
      } else {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { dmWinners: null }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "You have Disabled DM Winners Option.", "RED") ]});
      }
    }
    if(option == "snipes") {
      let snStatus = settings.snipes;
      if(snStatus == null) {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { snipes: true }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "You have Enabled Snipes Option.", "YELLOW") ]});
      } else {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { snipes: null }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "You have Disabled Snipes Option.", "RED") ]});
      }
    }
    if(option == "wlcmimg") {
      let img = settings.wlcmImage;
      if(img == null) {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { wlcmImage: true }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "You have Enabled Welcome Image Option.", "YELLOW") ]});
      } else {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { wlcmImage: null }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "You have Disabled Welcome Image Option.", "RED") ]});
      }
    }
    if(option == "imgchannel") {
      let channel = interaction.guild.channels.cache.get(value);
      if (!value) {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { welcomeChannel: null }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, `Welcome Channel have been rested.`, "RED") ]});
      }
      if (value) {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { welcomeChannel: `${channel.id}` }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, `Welcome Channel has been set to ${channel}.
To reset it just use command without arguments.`, "YELLOW") ]});
      }
    }
    if(option == "reaction") {
      if(premiumGuild != true) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
        `Error`, `This option is only available for Premium Guilds, use command \`premium\` to get more informations.`, "YELLOW")], ephemeral: true });
      if (!parse(value)[0]) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Error`, "You have entered invalid emoji (Custom Emojis are not supported).", "RED")], ephemeral: true });
      if (parse(value)[0]) {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, { customEmoji: `${parse(value)[0].text}` }, { new: true, upsert: true });
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, `You have Changed Giveaway Reaction Emoji to ${parse(args[1])[0].text}.

❗ **If you have any running giveaways, users will no longer be able to enter them because of new Reaction Emoji
but users who are already participating won't be affected** ❗`, "YELLOW") ]});
      }
    }
  }
};
