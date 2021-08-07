const Command = require("../../structures/Command");
const Discord = require('discord.js');
const ms = require('ms');
const db = require("quick.db");

module.exports = class GiveawayCreate extends Command {
	constructor(client) {
		super(client, {
			name: "gcreate",
			description: "start new giveaway using interactive menu",
			usage: "gcreate",
			permissions: ["ADMINISTRATOR"],
			aliases: ["gwcreate", "gwsetup", "gsetup"],
			category: "giveaway",
			listed: true,
		});
	}
    
  async run(message, args) {
    if(message.author.id != "823228305167351808") return message.reply("Command is in development mode, use +gstart")
    let embed = new Discord.MessageEmbed()
      .setColor("BLURPLE")
      .setAuthor("Giveaway Setup", this.client.user.displayAvatarURL());

    let filter = m => m.author.id === message.author.id;
    this.client.setupUtils.durationSetup(this.client, message, embed, filter);
  }
};