const Command = require("../../structures/Command");
const Discord = require("discord.js");
const User = require("../../models/User.js");

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
        type: "STRING",
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
      await User.updateMany({ guild: message.guild.id }, { $unset: { "invitesJoins": 1
        , "invitesLeaves": 1, "invitesBonus": 1, "invitesRegular": 1 }});
      
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Invites Reseted", "Invites of all users have been reseted", "YELLOW") ]});
    } else if(reset == "user") {
      await User.findOneAndUpdate({ id: user.id, guild: message.guild.id }, { $unset: { "invitesJoins": 1
        , "invitesLeaves": 1, "invitesBonus": 1, "invitesRegular": 1 }}, { new: true, upsert: true });

      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Invites Reseted", `Invites of user ${user} have been reseted`, "YELLOW") ]});
    }
  }
  async slashRun(interaction, args) {
    let reset = interaction.options.getString("reset_type");
    let user = interaction.options.getUser("user");
  
    if (reset == "guild") {
      await User.updateMany({ guild: interaction.guild.id }, { $unset: { "invitesJoins": 1
        , "invitesLeaves": 1, "invitesBonus": 1, "invitesRegular": 1 }});
  
      interaction.reply({ embeds: [this.client.embedBuilder(this.client, interaction.user, "Invites Reseted", "Invites of all users have been reseted", "YELLOW")] });
    } else if (reset == "user") {
      if(!user) 
        return interaction.reply({ embeds: [this.client.embedBuilder(this.client, interaction.user, "Error", "You didn't provide User whoes Invites to reset.", "RED")] });
      await User.findOneAndUpdate({ id: user.id, guild: interaction.guild.id }, { $unset: { "invitesJoins": 1
        , "invitesLeaves": 1, "invitesBonus": 1, "invitesRegular": 1 }}, { new: true, upsert: true });

      interaction.reply({ embeds: [this.client.embedBuilder(this.client, interaction.user, "Invites Reseted", `Invites of user ${user} have been reseted`, "YELLOW")] });
    }
  }
};
