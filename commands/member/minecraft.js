const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class Minecraft extends Command {
  constructor(client) {
    super(client, {
      name: "minecraft",
      description: "minecraft achievement with your text",
      usage: "minecraft [Tekst]",
      aliases: ["mc", "achievement", "ach", "mcach"],
      permissions: [],
      category: "member",
      listed: true,
    });
  }

  async run(message, args) {
    var text = args.join(' ')
    if (text.toLowerCase().includes("ž") ||
      text.toLowerCase().includes("č") ||
      text.toLowerCase().includes("ć") ||
      text.toLowerCase().includes("š") ||
      text.toLowerCase().includes("đ")) return message.channel.send({ content: "> Instead of **'Š, Đ, Č, Ć, Ž'** use **'S, Dj, C, C, Z'**" });

    let embedError = new Discord.MessageEmbed()
      .setAuthor("Error", this.client.user.displayAvatarURL())
      .setDescription(`You need to enter text.`)
      .setTimestamp()
      .setFooter(message.author.username, message.author.displayAvatarURL({ size: 1024, dynamic: true }))
      .setColor("RANDOM");

    var url = "https://minecraftskinstealer.com/achievement/" + (Math.floor(Math.random() * 30) + 1) + "/Achievement+Get%21/" + text;
    let file = new Discord.MessageAttachment(await url, "MinecraftAchievement.png");

    if (!text) return message.channel.send({ embeds: [embedError] });
    message.channel.send({ files: [file] });
  }
};