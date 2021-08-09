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
    if(!args[0]) return message.channel.send(
      this.client.embedBuilder(this.client, message, "Error", "You need to enter join message or in order to clear it just type 'none'", "RED")
    );
    if (args[0].toLowerCase() == "none") {
      db.delete(`server_${message.guild.id}_leaveMessage`);
      let msgEmbedClear = new Discord.MessageEmbed()
        .setDescription(`Leave Message have been reseted.`)
        .setColor("BLURPLE");
      message.channel.send({ embeds: [msgEmbedClear] });
    }
    if (args[0]) {
      db.set(`server_${message.guild.id}_leaveMessage`, args.join(" "));
      let msgEmbed = new Discord.MessageEmbed()
        .setAuthor("Leave Message", this.client.user.displayAvatarURL())
        .setDescription(`You have Changed Message which is sent to invites logging channel when member leave server.
To clear Message just use "none".
Use \`variables\` Command to view all available Variables.`)
        .setColor("BLURPLE");
      message.channel.send(msgEmbed);
    }
  }
};