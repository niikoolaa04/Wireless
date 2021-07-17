const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class Discriminator extends Command {
  constructor(client) {
    super(client, {
      name: "discriminator",
      description: "get users with same tag",
      usage: "discriminator [4 digits]",
      aliases: ["discrim"],
      permissions: [],
      category: "member",
      listed: false,
    });
  }

  async run(message, args) {
    var allowedToUse = false;
    this.client.dev_ids.forEach(id => {
      if (message.author.id == id) allowedToUse = true;
    });
    if (!allowedToUse) return;
    const discrim = args[0];
    if (!discrim || isNaN(discrim)) return message.channel.send(this.client.embedBuilder(this.client, message, `Error`, "You have entered invalid discriminator.", "RED"));

    let members = this.client.users.cache.filter(c => c.discriminator === discrim).map(c => c.tag);
    let content = "";
    if(members.length >= 45) content = members.slice(0, 20).join("\n");
    else content = members.join("\n");

    let embed = new Discord.MessageEmbed()
      .setAuthor("Discriminator", this.client.user.displayAvatarURL())
      .setDescription(`Users with Discriminator \`#${discrim}\`
  
>>> ${content}`)
      .setColor("BLURPLE");

    message.channel.send(embed);
  }
};