const Command = require("../../structures/Command");
const db = require("quick.db");
const Discord = require("discord.js");

module.exports = class ResetInvites extends Command {
	constructor(client) {
		super(client, {
			name: "resetinvites",
			description: "Reset invites for user or guild",
			usage: "resetinvites [all || user]",
			permissions: ["ADMINISTRATOR"],
			category: "utility",
			listed: true,
			slash: true,
			options: [{
			  name: "reset_type",
			  description: "Whether to reset Invites of User or Guild",
			  required: true,
			  choices: [{
			    name: "Reset User Invites",
			    value: "user"
			  }, {
			    name: "Reset Guild Invites",
			    value: "guild"
			  }]
			}, {
			  name: "user",
			  description: "User whoes Invites to reset (if reseting user)",
			  type: "USER",
			  required: false
			}]
		});
	}
  
  async run(message, args) {
    let reset;
    let user = message.mentions.users.first() || this.client.users.cache.get(args[0]);
    if(user && user != undefined) reset = "user"
    else reset = "all";
    
    if(reset == "all") {
      let allInv = await db.all().filter(data => data.ID.startsWith(`invitesLeaves_${message.guild.id}`) && data.ID.startsWith(`invitesJoins_${message.guild.id}`) && data.ID.startsWith(`invitesRegular_${message.guild.id}`) && data.ID.startsWith(`invitesBonus_${message.guild.id}`));
      allInv.forEach(d => db.delete(d.ID));
      
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Invites Reseted", "Invites of all users have been reseted", "YELLOW") ]});
    } else if(reset == "user") {
      db.delete(`invitesLeaves_${message.guild.id}_${user.id}`);
      db.delete(`invitesBonus_${message.guild.id}_${user.id}`);
      db.delete(`invitesRegular_${message.guild.id}_${user.id}`);
      db.delete(`invitesJoins_${message.guild.id}_${user.id}`);
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Invites Reseted", `Invites of user ${user} have been reseted`, "YELLOW") ]});
    }
  }
  async slashRun(interaction, args) {
    let reset = interaction.options.getString("reset_type");
    let user = interaction.options.getUser("user");
  
    if (reset == "guild") {
      let allInv = await db.all().filter(data => data.ID.startsWith(`invitesLeaves_${interaction.guild.id}`) && data.ID.startsWith(`invitesJoins_${interaction.guild.id}`) && data.ID.startsWith(`invitesRegular_${interaction.guild.id}`) && data.ID.startsWith(`invitesBonus_${interaction.guild.id}`));
      allInv.forEach(d => db.delete(d.ID));
  
      interaction.reply({ embeds: [this.client.embedBuilder(this.client, interaction.user, "Invites Reseted", "Invites of all users have been reseted", "YELLOW")] });
    } else if (reset == "user") {
      if(!user) 
        return interaction.reply({ embeds: [this.client.embedBuilder(this.client, interaction.user, "Error", "You didn't provide User whoes Invites to reset.", "RED")] });
      db.delete(`invitesLeaves_${interaction.guild.id}_${user.id}`);
      db.delete(`invitesBonus_${interaction.guild.id}_${user.id}`);
      db.delete(`invitesRegular_${interaction.guild.id}_${user.id}`);
      db.delete(`invitesJoins_${interaction.guild.id}_${user.id}`);
      interaction.reply({ embeds: [this.client.embedBuilder(this.client, interaction.user, "Invites Reseted", `Invites of user ${user} have been reseted`, "YELLOW")] });
    }
  }
};
