const Command = require("../../structures/Command");
const db = require("quick.db");
const Discord = require("discord.js");

module.exports = class BlacklistRole extends Command {
  constructor(client) {
    super(client, {
      name: "blacklistrole",
      description: "role which won't have ability to enter giveaways",
      usage: "blacklistrole [@Role]",
      permissions: ["ADMINISTRATOR"],
      category: "utility",
      listed: true,
    });
  }

  async run(message, args) {
    let role = message.mentions.roles.first();
    let gwRole = db.fetch(`server_${message.guild.id}_blacklistRole`);

    let next = false;
    if (gwRole != null) {
      db.delete(`server_${message.guild.id}_blacklistRole`);
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
        `Blacklist Role`, "You have successfully reseted Blacklist Role.", "YELLOW") ]});
      next = true;
    }
    if (next == true) return;

    if (!role) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message,
      `Error`, "You haven't mentioned role.", "RED") ]});

    db.set(`settings_${message.guild.id}_blacklistRole`, role.id);

    let embed = new Discord.MessageEmbed()
      .setAuthor("Prefix", this.client.user.displayAvatarURL())
      .setDescription(`Giveaway Requirements Blacklist Role have been successfully changed to \`${role}\``)
      .setColor("BLURPLE");

    message.channel.send({ embeds: [embed] });
  }
};