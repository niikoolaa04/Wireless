const Command = require("../../structures/Command");
const Discord = require("discord.js");
const db = require("quick.db");

module.exports = class Config extends Command {
	constructor(client) {
		super(client, {
			name: "config",
			description: "Edit Bot Configuration",
			usage: "config [Option] [Value]",
			permissions: ["ADMINISTRATOR"],
			category: "utility",
			listed: true,
		});
	}
  
  async run(message, args) {
    let option = args[0];
    
    if(!option || option > 9 || option < 1) {
      let prefix = db.fetch(`settings_${message.guild.id}_prefix`) || this.client.config.prefix;
      let bypass = db.fetch(`server_${message.guild.id}_bypassRole`);
      let blacklist = db.fetch(`server_${message.guild.id}_blacklistRole`);
      let channel = db.fetch(`channel_${message.guild.id}_invites`);
      let join = db.fetch(`server_${message.guild.id}_joinMessage`) || 'No Message';
      let leave = db.fetch(`server_${message.guild.id}_leaveMessage`) || 'No Message';
      let winners = db.fetch(`server_${message.guild.id}_dmWinners`);
      let snipes = db.fetch(`server_${message.guild.id}_snipes`);
      let image = db.fetch(`server_${message.guild.id}_welcomeImg`);
      let wlcmChannel = db.fetch(`channel_${message.guild.id}_welcome`);

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
        .addField(`📞 - Welcome Channel (9)`, wlcmChannel ? `<#${wlcmChannel}>` : 'No Channel')
        .setColor("BLURPLE")
        .setThumbnail(this.client.user.displayAvatarURL())
        .setTimestamp()
        .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }));

      message.channel.send({ embeds:  [noOption] });
    }

    if(option == 1) {
      let role = message.mentions.roles.first();
      let gwRole = db.fetch(`server_${message.guild.id}_bypassRole`);
       
      if(!gwRole) {
        if (!role) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Error`, "You haven't mentioned role.", "RED") ]});
        
        db.set(`server_${message.guild.id}_bypassRole`, role.id);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, `Giveaway Requirements Bypass Role have been successfully changed to \`${role}\`.`, "YELLOW") ]});
      } else {
        db.delete(`server_${message.guild.id}_bypassRole`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
        `Config`, "You have successfully reseted Bypass Role.", "RED") ]});
      }
    }
    if(option == 2) {
      let role = message.mentions.roles.first();
      let gwRole = db.fetch(`server_${message.guild.id}_blacklistRole`);

      if(!gwRole) {
        if (!role) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Error`, "You haven't mentioned role.", "RED") ]});
    
        db.set(`server_${message.guild.id}_blacklistRole`, role.id);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, `Giveaway Requirements Blacklist Role have been successfully changed to \`${role}\`.`, "YELLOW") ]});
      } else {
        db.delete(`server_${message.guild.id}_blacklistRole`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "You have successfully reseted Blacklist Role.", "RED") ]});
      }
    }
    if(option == 3) {
      let channel = message.mentions.channels.first();
      if (!channel) {
        db.delete(`channel_${message.guild.id}_invites`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, `Invites Channel have been rested.`, "RED") ]});
      }
      if (channel) {
        db.set(`channel_${message.guild.id}_invites`, channel.id);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, `Invites Channel has been set to ${channel}.
To reset it just use command without arguments.`, "YELLOW") ]});
      }
    }
    if(option == 4) {
      if(!args[1]) return message.channel.send(
        { embeds: [this.client.embedBuilder(this.client, message, "Error", "You need to enter join message or in order to clear it just type 'none'", "RED") ]}
      );
      if (args[1].toLowerCase() == "none") {
        db.delete(`server_${message.guild.id}_joinMessage`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "Join Message have been reseted.", "RED") ]});
      }
      if (args[1] && args[1].toLowerCase() != "none") {
        let content = args.slice(1).join(" ");
        db.set(`server_${message.guild.id}_joinMessage`, content);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, `You have Changed Message which is sent to invites logging channel when member joins server.
To clear Message just use "none".
Use \`variables\` Command to view all available Variables.`, "YELLOW") ]});
      }
    }
    if(option == 5) {
      if(!args[1]) return message.channel.send(
        { embeds: [this.client.embedBuilder(this.client, message, "Error", "You need to enter leave message or in order to clear it just type 'none'", "RED")] }
      );
      if (args[1].toLowerCase() == "none") {
        db.delete(`server_${message.guild.id}_leaveMessage`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "Leave Message have been reseted.", "RED") ]});
      }
      if (args[1] && args[1].toLowerCase() != "none") {
        let content = args.slice(1).join(" ");
        db.set(`server_${message.guild.id}_leaveMessage`, content);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, `You have Changed Message which is sent to invites logging channel when member leave server.
To clear Message just use "none".
Use \`variables\` Command to view all available Variables.`, "YELLOW") ]});
      }
    }
    if(option == 6) {
      let dm = db.fetch(`server_${message.guild.id}_dmWinners`);
      if(dm == null) {
        db.set(`server_${message.guild.id}_dmWinners`, true);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "You have Enabled DM Winners Option.", "YELLOW") ]});
      } else {
        db.delete(`server_${message.guild.id}_dmWinners`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "You have Disabled DM Winners Option.", "RED") ]});
      }
    }
    if(option == 7) {
      if(message.guild.id != this.client.config.developer.server) return;
      let snStatus = db.fetch(`server_${message.guild.id}_snipes`);
      if(snStatus == null) {
        db.set(`server_${message.guild.id}_snipes`, true);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "You have Enabled Snipes Option.", "YELLOW") ]});
      } else {
        db.delete(`server_${message.guild.id}_snipes`);
        db.delete(`snipes_${message.guild.id}`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "You have Disabled Snipes Option.", "RED") ]});
      }
    }
    if(option == 8) {
      if(message.guild.id != this.client.config.developer.server) return;
      let img = db.fetch(`server_${message.guild.id}_welcomeImg`);
      if(img == null) {
        db.set(`server_${message.guild.id}_welcomeImg`, true);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "You have Enabled Welcome Image Option.", "YELLOW") ]});
      } else {
        db.delete(`server_${message.guild.id}_welcomeImg`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, "You have Disabled Welcome Image Option.", "RED") ]});
      }
    }
    if(option == 9) {
      if(message.guild.id != this.client.config.developer.server) return;
      let channel = message.mentions.channels.first();
      if (!channel) {
        db.delete(`channel_${message.guild.id}_welcome`);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, `Welcome Channel have been rested.`, "RED") ]});
      }
      if (channel) {
        db.set(`channel_${message.guild.id}_welcome`, channel.id);
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
          `Config`, `Welcome Channel has been set to ${channel}.
To reset it just use command without arguments.`, "YELLOW") ]});
      }
    }
  }
};