const Command = require("../../structures/Command");
const Discord = require("discord.js");
const db = require("quick.db");

module.exports = class InvitesLeaveMessage extends Command {
  constructor(client) {
    super(client, {
      name: "leavemessage",
      description: "message sent to invites channel on member leave",
      usage: "leavemessage [Message || none]",
      permissions: ["ADMINISTRATOR"],
      category: "utility",
      listed: true,
    });
  }

  async run(message, args) {
    if (args[0].toLowerCase() == "none") {
      db.delete(`server_${message.guild.id}_joinMessage`);
      let msgEmbedClear = new Discord.MessageEmbed()
        .setDescription(`Leave Message have been reseted.`)
        .setColor("BLURPLE");
      message.channel.send(msgEmbedClear);
    }
    if (args[0]) {
      db.set(`server_${message.guild.id}_leaveMessage`, args.join(" "));
      let msgEmbed = new Discord.MessageEmbed()
        .setAuthor("Leave Message", this.client.user.displayAvatarURL())
        .setDescription(`You have Changed Message which is sent to invites logging channel when member leave server.
To clear Message just use "none".

\`{username}\` - Username of Member
\`{userTag}\` - Username & Tag of Member
\`{members}\` - Guild Member Count
\`{userID}\` - Member ID
\`{created}\` - Date of Account Creation
\`{invitedBy}\` - Username of Inviter
\`{totalInvites}\` - Total Invites 
\`{regularInvites}\` - Regular Invites
\`{leavesInvites}\` - Leaves Invites`)
        .setColor("BLURPLE");
      message.channel.send(msgEmbed);
    }
  }
};