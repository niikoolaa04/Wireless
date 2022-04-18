const Command = require("../../structures/Command");
const db = require("quick.db");
const Discord = require("discord.js");

module.exports = class BonusInvites extends Command {
	constructor(client) {
		super(client, {
			name: "bonusinvites",
			description: "Add/remove bonus invites to user",
			usage: "bonusinvites [add/remove] [@User] [invites]",
			permissions: ["ADMINISTRATOR"],
			category: "utility",
			listed: true,
			slash: true,
			options: [{
			  name: "action",
			  description: "Whether to Add or Remove Bonus Invites",
			  type: "STRING",
			  required: true,
			  choices: [{
			    name: "Add Bonus Invites",
			    value: "add"
			  }, {
			    name: "Remove Bonus Invites",
			    value: "remove"
			  }]
			}, {
			  name: "user",
			  description: "User to which to add or remove Invites",
			  type: "USER",
			  required: true
			}, {
			  name: "invites",
			  description: "Number of Invites to add/remove",
			  type: "INTEGER",
			  required: true
			}]
		});
	}
  
  async run(message, args) {
    let type = args[0];
    let user = message.mentions.users.first() || this.client.users.cache.get(args[1]);
    let amount = args[2];
    if(!amount || isNaN(amount) || amount < 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
      `Error`, "You have entered invalid amount of invites.", "RED") ]});
    if(type != "add" && type != "remove") return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
      `Error`, "You have entered invalid option (add/remove).", "RED") ]});
    
    if(type == "add") {
      db.add(`invitesBonus_${message.guild.id}_${user.id}`, parseInt(amount));
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
        `Bonus Invites`, `You have successfully added ${amount} Bonus Invites to ${user}.`, "YELLOW") ]});
    } else if(type == "remove") {
      let bonus = db.fetch(`invitesBonus_${message.guild.id}_${user.id}`);
      if((bonus - amount) < 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
      `Error`, "You cannot remove that much invites.", "RED") ]});
      
      db.subtract(`invitesBonus_${message.guild.id}_${user.id}`, parseInt(amount));
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author,
        `Bonus Invites`, `You have successfully added ${amount} Bonus Invites to ${user}.`, "YELLOW") ]});
    }
  }
  async slashRun(interaction, args) {
    let type = interaction.options.getString("action");
    let user = interaction.options.getUser("user");
    let amount = interaction.options.getInteger("invites");
    
    if(amount < 0) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
      `Error`, "You have entered invalid amount of invites.", "RED")], ephemeral: true });
    
    if(type == "add") {
      db.add(`invitesBonus_${interaction.guild.id}_${user.id}`, parseInt(amount));
      interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
        `Bonus Invites`, `You have successfully added ${amount} Bonus Invites to ${user}.`, "YELLOW") ]});
    } else if(type == "remove") {
      let bonus = db.fetch(`invitesBonus_${interaction.guild.id}_${user.id}`);
      if((bonus - amount) < 0) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
      `Error`, "You cannot remove that much invites.", "RED")], ephemeral: true });
      
      db.subtract(`invitesBonus_${interaction.guild.id}_${user.id}`, parseInt(amount));
      interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user,
        `Bonus Invites`, `You have successfully added ${amount} Bonus Invites to ${user}.`, "YELLOW")] });
    }
  }
};
