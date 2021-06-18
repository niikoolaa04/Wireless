const Command = require("../../structures/Command");
const db = require("quick.db");
const Discord = require("discord.js");

module.exports = class BonusInvites extends Command {
	constructor(client) {
		super(client, {
			name: "bonusinvites",
			description: "add/remove bonus invites to user",
			usage: "bonusinvites [add/remove] [@User] [invites]",
			permissions: ["ADMINISTRATOR"],
			category: "utility",
			listed: true,
		});
	}
  
  async run(message, args) {
    let type = args[0];
    let user = message.mentions.users.first() || this.client.users.cache.get(args[1]);
    let amount = args[2];
    if(!amount || isNaN(amount) || amount < 0) return message.channel.send(this.client.embedBuilder(this.client, message,
      `Error`, "You have entered invalid amount of invites.", "RED"));
    if(type != "add" && type != "remove") return message.channel.send(this.client.embedBuilder(this.client, message,
      `Error`, "You have entered invalid option (add/remove).", "RED"));
    
    if(type == "add") {
      db.add(`invitesBonus_${message.guild.id}_${user.id}`, parseInt(amount));
      message.channel.send(this.client.embedBuilder(this.client, message,
        `Bonus Invites`, `You have successfully added ${amount} Bonus Invites to ${user}.`, "YELLOW"));
    } else if(type == "remove") {
      let bonus = db.fetch(`invitesBonus_${message.guild.id}_${user.id}`);
      if((bonus - amount) < 0) return message.channel.send(this.client.embedBuilder(this.client, message,
      `Error`, "You cannot remove that much invites.", "RED"));
      
      db.subtract(`invitesBonus_${message.guild.id}_${user.id}`, parseInt(amount));
      message.channel.send(this.client.embedBuilder(this.client, message,
        `Bonus Invites`, `You have successfully added ${amount} Bonus Invites to ${user}.`, "YELLOW"));
    }
  }
};