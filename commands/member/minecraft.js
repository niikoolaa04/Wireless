const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class Minecraft extends Command {
  constructor(client) {
    super(client, {
      name: "minecraft",
      description: "Minecraft achievement with your text",
      usage: "minecraft [Tekst]",
      aliases: ["mc", "achievement", "ach", "mcach"],
      permissions: [],
      category: "member",
      listed: true,
      slash: true,
      options: [{
        name: 'text',
        type: 'STRING',
        description: "Text to Disaplay on Achievement",
        required: true,
      }]
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
      .setAuthor({ name: "Error", iconURL: this.client.user.displayAvatarURL() })
      .setDescription(`You need to enter text.`)
      .setTimestamp()
      .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ size: 1024, dynamic: true }) })
      .setColor("RANDOM");

    var url = "https://minecraftskinstealer.com/achievement/" + (Math.floor(Math.random() * 30) + 1) + "/Achievement+Get%21/" + text;
    let file = new Discord.MessageAttachment(await url, "MinecraftAchievement.png");

    if (!text) return message.channel.send({ embeds: [embedError] });
    message.channel.send({ files: [file] });
  }
  async slashRun(interaction, args) {
    var text = interaction.options.getString("text")
    if (text.toLowerCase().includes("ž") ||
      text.toLowerCase().includes("č") ||
      text.toLowerCase().includes("ć") ||
      text.toLowerCase().includes("š") ||
      text.toLowerCase().includes("đ")) return interaction.followUp({ content: "> Instead of **'Š, Đ, Č, Ć, Ž'** use **'S, Dj, C, C, Z'**" });

    let embedError = new Discord.MessageEmbed()
      .setAuthor({ name: "Error", iconURL: this.client.user.displayAvatarURL() })
      .setDescription(`You need to enter text.`)
      .setTimestamp()
      .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 1024, dynamic: true }) })
      .setColor("RANDOM");

    var url = "https://minecraftskinstealer.com/achievement/" + (Math.floor(Math.random() * 30) + 1) + "/Achievement+Get%21/" + text;
    let file = new Discord.MessageAttachment(await url, "MinecraftAchievement.png");

    if (!text) return interaction.reply({ embeds: [embedError] });
    interaction.reply({ files: [file] });
  }
};
