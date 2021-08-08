const Command = require("../../structures/Command");
const db = require("quick.db");
const Discord = require("discord.js");

module.exports = class Variables extends Command {
  constructor(client) {
    super(client, {
      name: "variables",
      description: "list of variables that can be used in join and leave messages",
      usage: "variables",
      permissions: ["MANAGE_MESSAGES"],
      category: "utility",
      listed: true,
    });
  }

  async run(message, args) {
    message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Variables", `You can use this Variables in Join \`(joinmessage)\` & Leave \`(leavemessage)\` Messages.
    
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
    interaction.followUp({ embeds: [ this.client.embedInteraction(this.client, interaction, "Variables", `You can use this Variables in Join \`(joinmessage)\` & Leave \`(leavemessage)\` Messages.
    
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