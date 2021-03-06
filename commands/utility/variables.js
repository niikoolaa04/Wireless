const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class Variables extends Command {
  constructor(client) {
    super(client, {
      name: "variables",
      description: "List of variables that can be used in join and leave messages",
      usage: "variables",
      permissions: ["MANAGE_MESSAGES"],
      category: "utility",
      listed: true,
      slash: true,
    });
  }

  async run(message, args) {
    message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Variables", `You can use this Variables in Join \`(joinmessage)\` & Leave \`(leavemessage)\` Messages.
    
**VARIABLES**

\`{username}\` - Username of Member
\`{userTag}\` - Username & Tag of Member
\`{members}\` - Number of Members
\`{userID}\` - Member ID
\`{created}\` - Date of Account Creation
\`{invitedBy}\` - Username of Inviter
\`{joinsInvites}\` - Join Invites 
\`{regularInvites}\` - Regular Invites
\`{bonusInvites}\` - Bonus Invites
\`{leavesInvites}\` - Leaves Invites
\`{totalInvites}\` - Regular + Bonus Invites`, "BLURPLE") ]});
  }
  async slashRun(interaction, args) {
    interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Variables", `You can use this Variables in Join \`(joinmessage)\` & Leave \`(leavemessage)\` Messages.
    
**VARIABLES**

\`{username}\` - Username of Member
\`{userTag}\` - Username & Tag of Member
\`{members}\` - Number of Members
\`{userID}\` - Member ID
\`{created}\` - Date of Account Creation
\`{invitedBy}\` - Username of Inviter
\`{joinsInvites}\` - Join Invites 
\`{regularInvites}\` - Regular Invites
\`{bonusInvites}\` - Bonus Invites
\`{leavesInvites}\` - Leaves Invites
\`{totalInvites}\` - Regular + Bonus Invites`, "BLURPLE") ]});
  }
};
