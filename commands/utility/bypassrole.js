const Command = require("../../structures/Command");
const db = require("quick.db");
const Discord = require("discord.js");

module.exports = class BypassRole extends Command {
  constructor(client) {
    super(client, {
      name: "bypassrole",
      description: "role which will have ability to bypass giveaway requirements",
      usage: "bypassrole [@Role]",
      permissions: ["ADMINISTRATOR"],
      category: "utility",
      listed: true,
    });
  }

  async run(message, args) {
    let role = message.mentions.roles.first();
    let gwRole = db.fetch(`server_${message.guild.id}_bypassRole`);
     
    let next = false;
    if (gwRole != null) {
      db.delete(`server_${message.guild.id}_bypassRole`);
      message.channel.send(this.client.embedBuilder(this.client, message,
      `Bypass Role`, "You have successfully reseted Bypass Role.", "YELLOW"));
      next = true;
    }
    if(next == true) return;
    
    if (!role) return message.channel.send(this.client.embedBuilder(this.client, message,
      `Error`, "You haven't mentioned role.", "RED"));
    
    db.set(`settings_${message.guild.id}_bypassRole`, role.id);

    let embed = new Discord.MessageEmbed()
      .setAuthor("Prefix", this.client.user.displayAvatarURL())
      .setDescription(`Giveaway Requirements Bypass Role have been successfully changed to \`${role}\``)
      .setColor("BLURPLE");

    message.channel.send(embed);
  }
};