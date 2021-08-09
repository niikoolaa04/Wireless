const Command = require("../../structures/Command");
const Discord = require("discord.js");
const db = require("quick.db");

module.exports = class Config extends Command {
	constructor(client) {
		super(client, {
			name: "config",
			description: "change some config values",
			usage: "config [Option]",
			permissions: ["ADMINISTRATOR"],
			category: "config",
			listed: true,
		});
	}
  
  async run(message, args) {
    let option = args[0];
    
    if(!option) {
      let bypass = db.fetch(`server_${message.guild.id}_bypassRole`) || 'N/A';
      let blacklist = db.fetch(`server_${message.guild.id}_blacklistRole`) || 'N/A';
      let channel = db.fetch(`channel_${message.guild.id}_invites`) || 'N/A';
      let join = db.fetch(`server_${message.guild.id}_joinMessage`) || 'N/A';
      let leave = db.fetch(`server_${message.guild.id}_leaveMessage`) || 'N/A';
      let winners = db.fetch(`server_${message.guild.id}_dmWinners`) || 'No';

      let noOption = new Discord.MessageEmbed()
        .setAuthor("Config", this.client.user.displayAvatarURL())
        .addField(`Bypass Role`, bypass)
        .addField(`Blacklist Role`, blacklist)
        .addField(`Invites Channel`, channel)
        .addField(`Join Message`, join)
        .addField(`Leave Message`, leave)
        .addField(`DM Winners`, winners)
        .setColor("BLURPLE");

      message.channel.send({ embeds:  [noOption] })
    }

    if (option > 6 || option < 1 || isNaN(option))
      return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, 
        `Error`, 
        `You need to enter Number of Option.\n**Options:**\n${this.client.utils.configStrings()}`, "RED")] });
  
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
      if (args[1]) {
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
      if (args[1]) {
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
  }
};