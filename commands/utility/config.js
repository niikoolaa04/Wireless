const Command = require("../../structures/Command");
const Discord = require("discord.js");
const db = require("quick.db");
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
        name: 'reqrole',
        type: 'SUB_COMMAND',
        description: "Giveaway Role Requirement",
        options: [{
          name: 'rolereq',
          type: 'ROLE',
          description: "Giveaway Role Requirement",
          required: false
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
    let premiumGuild = db.fetch(`server_${message.guild.id}_premium`);
    
    if(!option || option > 11 || option < 1) {
      let prefix = db.fetch(`settings_${message.guild.id}_prefix`) || this.client.config.prefix;
      let bypass = db.fetch(`server_${message.guild.id}_bypassRole`);
      let blacklist = db.fetch(`server_${message.guild.id}_blacklistRole`);
      let channel = db.fetch(`channel_${message.guild.id}_invites`);
      let join = db.fetch(`server_${message.guild.id}_joinMessage`) || 'No Message';
      let leave = db.fetch(`server_${message.guild.id}_leaveMessage`) || 'No Message';
      let winners = db.fetch(`server_${message.guild.id}_dmWinners`);
      let snipes = db.fetch(`server_${message.guild.id}_snipes`);
      let image = db.fetch(`server_${message.guild.id}_welcomeImg`);
      let roleReq = db.fetch(`server_${message.guild.id}_roleReq`);
      let wlcmChannel = db.fetch(`channel_${message.guild.id}_welcome`);
      let customReaction = db.fetch(`server_${message.guild.id}_customReaction`);

      let noOption = new Discord.MessageEmbed()
        .setAuthor({ name: "Configuration", iconURL: this.client.user.displayAvatarURL() })
        .setDescription(`To Change Config Value do \`${prefix}config [Option] [Value]\``)
        .addField(`🌙 - Bypass Role (1)`, bypass ? `<@${bypass}>` : 'No Role')
        .addField(`❌ - Blacklist Role (2)`, blacklist ? `<@${blacklist}>` : 'No Role')
        .addField(`🎫 - Invites Channel (3)`, channel ? `<#${channel}>` : 'No Channel')
        .addField(`🚪 - Join Message (4)`, "`" + join + "`")
        .addField(`✨ - Leave Message (5)`, "`" + leave + "`")
        .addField(`💬 - DM Winners (6)`, winners ? `Yes` : 'No')
        .addField(`🔎 - Snipes (7)`, snipes ? `Yes` : 'No')
        .addField(`👋 - Welcome Image (8)`, image ? `Yes` : 'No')
        .addField(`📞 - Welcome Channel for Image (9)`, wlcmChannel ? `<#${wlcmChannel}>` : 'No Channel')
        .addField(`🎭 - Role Requirement (10)`, roleReq ? `<@${roleReq}>` : 'No Role')
        .addField(`💥 - Custom GW Reaction (11)`, customReaction ? `${customReaction}` : '🎉')
        .setColor("BLURPLE")
        .setThumbnail(this.client.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

      message.channel.send({ embeds:  [noOption] });
    }

    if(option == 1) {
      let role = message.mentions.roles.first();
      let gwRole = db.fetch(`server_${message.guild.id}_bypassRole`);
       
      if(!gwRole) {
        if (!role) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Error`, "You haven't mentioned role.", "RED") ]});
        
        db.set(`server_${message.guild.id}_bypassRole`, role.id);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, `Giveaway Requirements Bypass Role have been successfully changed to \`${role}\`.`, "YELLOW") ]});
      } else {
        db.delete(`server_${message.guild.id}_bypassRole`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
        `Config`, "You have successfully reseted Bypass Role.", "RED") ]});
      }
    }
    if(option == 2) {
      let role = message.mentions.roles.first();
      let gwRole = db.fetch(`server_${message.guild.id}_blacklistRole`);

      if(!gwRole) {
        if (!role) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Error`, "You haven't mentioned role.", "RED") ]});
    
        db.set(`server_${message.guild.id}_blacklistRole`, role.id);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, `Giveaway Requirements Blacklist Role have been successfully changed to \`${role}\`.`, "YELLOW") ]});
      } else {
        db.delete(`server_${message.guild.id}_blacklistRole`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "You have successfully reseted Blacklist Role.", "RED") ]});
      }
    }
    if(option == 3) {
      let channel = message.mentions.channels.first();
      if (!channel) {
        db.delete(`channel_${message.guild.id}_invites`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, `Invites Channel have been rested.`, "RED") ]});
      }
      if (channel) {
        db.set(`channel_${message.guild.id}_invites`, channel.id);
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
        db.delete(`server_${message.guild.id}_joinMessage`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "Join Message have been reseted.", "RED") ]});
      }
      if (args[1] && args[1].toLowerCase() != "none") {
        let content = args.slice(1).join(" ");
        db.set(`server_${message.guild.id}_joinMessage`, content);
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
        db.delete(`server_${message.guild.id}_leaveMessage`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "Leave Message have been reseted.", "RED") ]});
      }
      if (args[1] && args[1].toLowerCase() != "none") {
        let content = args.slice(1).join(" ");
        db.set(`server_${message.guild.id}_leaveMessage`, content);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, `You have Changed Message which is sent to invites logging channel when member leave server.
To clear Message just use "none".
Use \`variables\` Command to view all available Variables.`, "YELLOW") ]});
      }
    }
    if(option == 6) {
      let dm = db.fetch(`server_${message.guild.id}_dmWinners`);
      if(dm == null) {
        db.set(`server_${message.guild.id}_dmWinners`, true);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "You have Enabled DM Winners Option.", "YELLOW") ]});
      } else {
        db.delete(`server_${message.guild.id}_dmWinners`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "You have Disabled DM Winners Option.", "RED") ]});
      }
    }
    if(option == 7) {
      let snStatus = db.fetch(`server_${message.guild.id}_snipes`);
      if(snStatus == null) {
        db.set(`server_${message.guild.id}_snipes`, true);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "You have Enabled Snipes Option.", "YELLOW") ]});
      } else {
        db.delete(`server_${message.guild.id}_snipes`);
        db.delete(`snipes_${message.guild.id}`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "You have Disabled Snipes Option.", "RED") ]});
      }
    }
    if(option == 8) {
      let img = db.fetch(`server_${message.guild.id}_welcomeImg`);
      if(img == null) {
        db.set(`server_${message.guild.id}_welcomeImg`, true);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "You have Enabled Welcome Image Option.", "YELLOW") ]});
      } else {
        db.delete(`server_${message.guild.id}_welcomeImg`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, "You have Disabled Welcome Image Option.", "RED") ]});
      }
    }
    if(option == 9) {
      let channel = message.mentions.channels.first();
      if (!channel) {
        db.delete(`channel_${message.guild.id}_welcome`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, `Welcome Channel have been rested.`, "RED") ]});
      }
      if (channel) {
        db.set(`channel_${message.guild.id}_welcome`, channel.id);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, `Welcome Channel has been set to ${channel}.
To reset it just use command without arguments.`, "YELLOW") ]});
      }
    }
    if(option == 10) {
      let role = message.mentions.roles.first();
      if (!role) {
        db.delete(`server_${message.guild.id}_roleReq`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, `Role Requirement have been rested.`, "RED") ]});
      }
      if (role) {
        db.set(`server_${message.guild.id}_roleReq`, role.id);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Config`, `Role Requirement has been set to ${role}.
To reset it just use command without arguments.`, "YELLOW") ]});
      }
    }
    if(option == 11) {
      if(premiumGuild != true) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
        `Error`, `This option is only available for Premium Guilds, use command \`premium\` to get more informations.`, "YELLOW") ]});
      if(!args[1]) return message.channel.send(
        { embeds: [this.client.embedBuilder(this.client, message.author, "Error", "You need to enter emoji.", "RED")] }
      );
      if (!parse(args[1])[0]) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
          `Error`, "You have entered invalid emoji (Custom Emojis are not supported).", "RED") ]});
      if (parse(args[1])[0]) {
        db.set(`server_${message.guild.id}_customReaction`, parse(args[1])[0].text);
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
    let premiumGuild = db.fetch(`server_${interaction.guild.id}_premium`);
    
    if(option == "list") {
      let prefix = db.fetch(`settings_${interaction.guild.id}_prefix`) || this.client.config.prefix;
      let bypass = db.fetch(`server_${interaction.guild.id}_bypassRole`);
      let blacklist = db.fetch(`server_${interaction.guild.id}_blacklistRole`);
      let channel = db.fetch(`channel_${interaction.guild.id}_invites`);
      let join = db.fetch(`server_${interaction.guild.id}_joinMessage`) || 'No Message';
      let leave = db.fetch(`server_${interaction.guild.id}_leaveMessage`) || 'No Message';
      let winners = db.fetch(`server_${interaction.guild.id}_dmWinners`);
      let snipes = db.fetch(`server_${interaction.guild.id}_snipes`);
      let image = db.fetch(`server_${interaction.guild.id}_welcomeImg`);
      let roleReq = db.fetch(`server_${interaction.guild.id}_roleReq`);
      let wlcmChannel = db.fetch(`channel_${interaction.guild.id}_welcome`);
      let customReaction = db.fetch(`server_${interaction.guild.id}_customReaction`);

      let noOption = new Discord.MessageEmbed()
        .setAuthor({ name: "Configuration", iconURL: this.client.user.displayAvatarURL() })
        .setDescription(`To Change Config Value do \`${prefix}config [Option] [Value]\``)
        .addField(`🌙 - Bypass Role (1)`, bypass ? `<@${bypass}>` : 'No Role')
        .addField(`❌ - Blacklist Role (2)`, blacklist ? `<@${blacklist}>` : 'No Role')
        .addField(`🎫 - Invites Channel (3)`, channel ? `<#${channel}>` : 'No Channel')
        .addField(`🚪 - Join Message (4)`, "`" + join + "`")
        .addField(`✨ - Leave Message (5)`, "`" + leave + "`")
        .addField(`💬 - DM Winners (6)`, winners ? `Yes` : 'No')
        .addField(`🔎 - Snipes (7)`, snipes ? `Yes` : 'No')
        .addField(`👋 - Welcome Image (8)`, image ? `Yes` : 'No')
        .addField(`📞 - Welcome Channel for Image (9)`, wlcmChannel ? `<#${wlcmChannel}>` : 'No Channel')
        .addField(`🎭 - Role Requirement (10)`, roleReq ? `<@${roleReq}>` : 'No Role')
        .addField(`💥 - Custom GW Reaction (11)`, customReaction ? `${customReaction}` : '🎉')
        .setColor("BLURPLE")
        .setThumbnail(this.client.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });

      interaction.reply({ embeds:  [noOption], ephemeral: true });
    }

    if(option == "bypassrole") {
      let gwRole = db.fetch(`server_${interaction.guild.id}_bypassRole`);
      let role = interaction.guild.roles.cache.get(value); 
       
      if(!gwRole) {
        if (!value) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Error`, "You haven't mentioned role.", "RED")], ephemeral: true });
          
        db.set(`server_${interaction.guild.id}_bypassRole`, role.id);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, `Giveaway Requirements Bypass Role have been successfully changed to \`${role}\`.`, "YELLOW") ]});
      } else {
        db.delete(`server_${interaction.guild.id}_bypassRole`);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
        `Config`, "You have successfully reseted Bypass Role.", "RED") ]});
      }
    }
    if(option == "blacklistrole") {
      let role = interaction.guild.roles.cache.get(value);
      let gwRole = db.fetch(`server_${interaction.guild.id}_blacklistRole`);

      if(!gwRole) {
        if (!value) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Error`, "You haven't mentioned role.", "RED")], ephemeral: true });
    
        db.set(`server_${interaction.guild.id}_blacklistRole`, role.id);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, `Giveaway Requirements Blacklist Role have been successfully changed to \`${role}\`.`, "YELLOW") ]});
      } else {
        db.delete(`server_${interaction.guild.id}_blacklistRole`);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "You have successfully reseted Blacklist Role.", "RED") ]});
      }
    }
    if(option == "inviteschannel") {
      let channel = interaction.guild.channels.cache.get(value);
      if (!value) {
        db.delete(`channel_${interaction.guild.id}_invites`);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, `Invites Channel have been rested.`, "RED") ]});
      }
      if (value) {
        db.set(`channel_${interaction.guild.id}_invites`, channel.id);
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
        db.delete(`server_${interaction.guild.id}_joinMessage`);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "Join Message have been reseted.", "RED") ]});
      }
      if (args[1] && args[1].toLowerCase() != "none") {
        db.set(`server_${interaction.guild.id}_joinMessage`, value);
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
        db.delete(`server_${interaction.guild.id}_leaveMessage`);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "Leave Message have been reseted.", "RED") ]});
      }
      if (args[1] && args[1].toLowerCase() != "none") {
        db.set(`server_${interaction.guild.id}_leaveMessage`, value);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, `You have Changed Message which is sent to invites logging channel when member leave server.
To clear Message just use "none".
Use \`variables\` Command to view all available Variables.`, "YELLOW") ]});
      }
    }
    if(option == "dmwinners") {
      let dm = db.fetch(`server_${interaction.guild.id}_dmWinners`);
      if(dm == null) {
        db.set(`server_${interaction.guild.id}_dmWinners`, true);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "You have Enabled DM Winners Option.", "YELLOW") ]});
      } else {
        db.delete(`server_${interaction.guild.id}_dmWinners`);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "You have Disabled DM Winners Option.", "RED") ]});
      }
    }
    if(option == "snipes") {
      let snStatus = db.fetch(`server_${interaction.guild.id}_snipes`);
      if(snStatus == null) {
        db.set(`server_${interaction.guild.id}_snipes`, true);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "You have Enabled Snipes Option.", "YELLOW") ]});
      } else {
        db.delete(`server_${interaction.guild.id}_snipes`);
        db.delete(`snipes_${interaction.guild.id}`);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "You have Disabled Snipes Option.", "RED") ]});
      }
    }
    if(option == "wlcmimg") {
      let img = db.fetch(`server_${interaction.guild.id}_welcomeImg`);
      if(img == null) {
        db.set(`server_${interaction.guild.id}_welcomeImg`, true);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "You have Enabled Welcome Image Option.", "YELLOW") ]});
      } else {
        db.delete(`server_${interaction.guild.id}_welcomeImg`);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, "You have Disabled Welcome Image Option.", "RED") ]});
      }
    }
    if(option == "imgchannel") {
      let channel = interaction.guild.channels.cache.get(value);
      if (!value) {
        db.delete(`channel_${interaction.guild.id}_welcome`);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, `Welcome Channel have been rested.`, "RED") ]});
      }
      if (value) {
        db.set(`channel_${interaction.guild.id}_welcome`, channel.id);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, `Welcome Channel has been set to ${channel}.
To reset it just use command without arguments.`, "YELLOW") ]});
      }
    }
    if(option == "reqrole") {
      let reqRole = db.fetch(`server_${interaction.guild.id}_roleReq`);
      let role = interaction.guild.roles.cache.get(value); 
       
      if(!reqRole) {
        if (!value) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Error`, "You haven't mentioned role.", "RED")], ephemeral: true });
          
        db.set(`server_${interaction.guild.id}_roleReq`, role.id);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, `Giveaway Requirement Role have been successfully changed to \`${role}\`.`, "YELLOW") ]});
      } else {
        db.delete(`server_${interaction.guild.id}_roleReq`);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
        `Config`, "You have successfully reseted Giveaway Requirement Role.", "RED") ]});
      }
    }
    if(option == "reaction") {
      if(premiumGuild != true) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
        `Error`, `This option is only available for Premium Guilds, use command \`premium\` to get more informations.`, "YELLOW")], ephemeral: true });
      if (!parse(value)[0]) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Error`, "You have entered invalid emoji (Custom Emojis are not supported).", "RED")], ephemeral: true });
      if (parse(value)[0]) {
        db.set(`server_${message.guild.id}_customReaction`, parse(value)[0].text);
        interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
          `Config`, `You have Changed Giveaway Reaction Emoji to ${parse(args[1])[0].text}.

❗ **If you have any running giveaways, users will no longer be able to enter them because of new Reaction Emoji
but users who are already participating won't be affected** ❗`, "YELLOW") ]});
      }
    }
  }
};
