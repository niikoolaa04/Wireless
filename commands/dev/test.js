const Command = require("../../structures/Command");
const Discord = require('discord.js');
const db = require("quick.db");

module.exports = class Test extends Command {
  constructor(client) {
    super(client, {
      name: "test",
      description: "Command for Testing",
      usage: "test",
      permissions: [],
      category: "dev",
      listed: false,
      slash: true, 
      options: [{
        name: 'list',
        type: 'SUB_COMMAND',
        description: "List of config options",
        required: true,
      },{
        name: 'bypass',
        type: 'SUB_COMMAND',
        description: "Giveaway Bypass Role",
        required: true,
        options: [{
          name: 'byrole', 
          type: 'ROLE', 
          required: false,
        }]
      },{
        name: 'blacklist',
        type: 'SUB_COMMAND',
        description: "Giveaway Blacklist Role",
        required: true,
        options: [{
          name: 'blrole', 
          type: 'ROLE', 
          required: false,
        }]
      },{
        name: 'invch',
        type: 'SUB_COMMAND',
        description: "Invites Channel",
        required: true,
        options: [{
          name: 'invchannel',
          type: 'CHANNEL',
          required: false,
        }]
      },{
        name: 'join',
        type: 'SUB_COMMAND',
        description: "Invites Join Message",
        required: true,
        options: [{
          name: 'joinmsg',
          type: 'STRING',
          required: true,
        }]
      },{
        name: 'leave',
        type: 'SUB_COMMAND',
        description: "Invites Leave Message",
        required: true,
        options: [{
          name: 'leavemsg',
          type: 'STRING',
          required: true,
        }]
      },{
        name: 'dmwinners',
        type: 'SUB_COMMAND',
        description: "Enable/Disable DM Winners",
        required: true,
      },{
        name: 'snipes',
        type: 'SUB_COMMAND',
        description: "Enable/Disable Snipes",
        required: true,
      },{
        name: 'wlcmimg',
        type: 'SUB_COMMAND',
        description: "Welcome Image",
        required: true,
      },{
        name: 'imgch',
        type: 'SUB_COMMAND',
        description: "Welcome Image Channel",
        required: true,
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
        required: true,
        options: [{
          name: 'rolereq',
          type: 'ROLE',
          description: "Giveaway Role Requirement",
          required: false
        }]
      }]
    });
  }

  async run(message, args) {
    var allowedToUse = false;
    this.client.dev_ids.forEach(id => {
      if (message.author.id == id) allowedToUse = true;
    });
    if (!allowedToUse) return;
  }
  async slashRun(interaction, args) {
    var allowedToUse = false;
    this.client.dev_ids.forEach(id => {
      if (interaction.user.id == id) allowedToUse = true;
    });
    if (!allowedToUse) return;
    let option = args[0];
    let value = args[1];
    
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

      let noOption = new Discord.MessageEmbed()
        .setAuthor("Configuration", this.client.user.displayAvatarURL())
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
        .setColor("BLURPLE")
        .setThumbnail(this.client.user.displayAvatarURL())
        .setTimestamp()
        .setFooter(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }));

      interaction.followUp({ embeds:  [noOption] });
    }

    if(option == "bypass") {
      let gwRole = db.fetch(`server_${interaction.guild.id}_bypassRole`);
      let role = interaction.guild.roles.cache.get(value); 
       
      if(!gwRole) {
        if (!value) return interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Error`, "You haven't mentioned role.", "RED") ]});
          
        db.set(`server_${interaction.guild.id}_bypassRole`, role.id);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, `Giveaway Requirements Bypass Role have been successfully changed to \`${role}\`.`, "YELLOW") ]});
      } else {
        db.delete(`server_${interaction.guild.id}_bypassRole`);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
        `Config`, "You have successfully reseted Bypass Role.", "RED") ]});
      }
    }
    if(option == "blacklist") {
      let role = interaction.guild.roles.cache.get(value);
      let gwRole = db.fetch(`server_${interaction.guild.id}_blacklistRole`);

      if(!gwRole) {
        if (!value) return interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Error`, "You haven't mentioned role.", "RED") ]});
    
        db.set(`server_${interaction.guild.id}_blacklistRole`, role.id);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, `Giveaway Requirements Blacklist Role have been successfully changed to \`${role}\`.`, "YELLOW") ]});
      } else {
        db.delete(`server_${interaction.guild.id}_blacklistRole`);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "You have successfully reseted Blacklist Role.", "RED") ]});
      }
    }
    if(option == "invch") {
      let channel = interaction.guild.channels.cache.get(value);
      if (!value) {
        db.delete(`channel_${interaction.guild.id}_invites`);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, `Invites Channel have been rested.`, "RED") ]});
      }
      if (value) {
        db.set(`channel_${interaction.guild.id}_invites`, channel.id);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, `Invites Channel has been set to ${channel}.
To reset it just use command without arguments.`, "YELLOW") ]});
      }
    }
    if(option == "join") {
      if(!args[1]) return interaction.followUp(
        { embeds: [this.client.embedBuilder(this.client, message, "Error", "You need to enter join message or in order to clear it just type 'none'", "RED") ]}
      );
      if (args[1].toLowerCase() == "none") {
        db.delete(`server_${interaction.guild.id}_joinMessage`);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "Join Message have been reseted.", "RED") ]});
      }
      if (args[1] && args[1].toLowerCase() != "none") {
        db.set(`server_${interaction.guild.id}_joinMessage`, value);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, `You have Changed Message which is sent to invites logging channel when member joins server.
To clear Message just use "none".
Use \`variables\` Command to view all available Variables.`, "YELLOW") ]});
      }
    }
    if(option == "leave") {
      if(!args[1]) return interaction.followUp(
        { embeds: [this.client.embedBuilder(this.client, message, "Error", "You need to enter leave message or in order to clear it just type 'none'", "RED")] }
      );
      if (args[1].toLowerCase() == "none") {
        db.delete(`server_${interaction.guild.id}_leaveMessage`);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "Leave Message have been reseted.", "RED") ]});
      }
      if (args[1] && args[1].toLowerCase() != "none") {
        db.set(`server_${interaction.guild.id}_leaveMessage`, value);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, `You have Changed Message which is sent to invites logging channel when member leave server.
To clear Message just use "none".
Use \`variables\` Command to view all available Variables.`, "YELLOW") ]});
      }
    }
    if(option == "dmwinners") {
      let dm = db.fetch(`server_${interaction.guild.id}_dmWinners`);
      if(dm == null) {
        db.set(`server_${interaction.guild.id}_dmWinners`, true);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "You have Enabled DM Winners Option.", "YELLOW") ]});
      } else {
        db.delete(`server_${interaction.guild.id}_dmWinners`);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "You have Disabled DM Winners Option.", "RED") ]});
      }
    }
    if(option == "snipes") {
      let snStatus = db.fetch(`server_${interaction.guild.id}_snipes`);
      if(snStatus == null) {
        db.set(`server_${interaction.guild.id}_snipes`, true);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "You have Enabled Snipes Option.", "YELLOW") ]});
      } else {
        db.delete(`server_${interaction.guild.id}_snipes`);
        db.delete(`snipes_${interaction.guild.id}`);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "You have Disabled Snipes Option.", "RED") ]});
      }
    }
    if(option == "wlcmimg") {
      let img = db.fetch(`server_${interaction.guild.id}_welcomeImg`);
      if(img == null) {
        db.set(`server_${interaction.guild.id}_welcomeImg`, true);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "You have Enabled Welcome Image Option.", "YELLOW") ]});
      } else {
        db.delete(`server_${interaction.guild.id}_welcomeImg`);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "You have Disabled Welcome Image Option.", "RED") ]});
      }
    }
    if(option == "imgch") {
      let channel = interaction.guild.channels.cache.get(value);
      if (!value) {
        db.delete(`channel_${interaction.guild.id}_welcome`);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, `Welcome Channel have been rested.`, "RED") ]});
      }
      if (value) {
        db.set(`channel_${interaction.guild.id}_welcome`, channel.id);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, `Welcome Channel has been set to ${channel}.
To reset it just use command without arguments.`, "YELLOW") ]});
      }
    }
    if(option == "reqrole") {
      let reqRole = db.fetch(`server_${interaction.guild.id}_roleReq`);
      let role = interaction.guild.roles.cache.get(value); 
       
      if(!reqRole) {
        if (!value) return interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Error`, "You haven't mentioned role.", "RED") ]});
          
        db.set(`server_${interaction.guild.id}_roleReq`, role.id);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, `Giveaway Requirement Role have been successfully changed to \`${role}\`.`, "YELLOW") ]});
      } else {
        db.delete(`server_${interaction.guild.id}_roleReq`);
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, message,
        `Config`, "You have successfully reseted Giveaway Requirement Role.", "RED") ]});
      }
    }
  }
};