const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class Ping extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "Bot's ping",
      usage: "ping",
      permissions: [],
      aliases: ["uptime"], 
      category: "member",
      listed: true,
      slash: true, 
    });
  }

  async run(message, args) {
    let embed = new Discord.MessageEmbed()
      .setAuthor("Ping", this.client.user.displayAvatarURL())
      .setDescription("Ping?")
      .setColor("YELLOW");

    const m = await message.channel.send({ embeds: [embed] });

    let embedEdit = new Discord.MessageEmbed()
      .setAuthor("Ping", this.client.user.displayAvatarURL())
      .setDescription(`Pong!
**Bot Uptime ·** ${this.client.utils.formatVreme(this.client.uptime)}
**Latency ·** ${m.createdTimestamp - message.createdTimestamp}ms
**API Latency ·** ${this.client.ws.ping}ms`)
      .setColor("BLURPLE");

    m.edit({ embeds: [embedEdit] });
  }
  async slashRun(interaction, args) {
    let embed = new Discord.MessageEmbed()
      .setAuthor("Ping", this.client.user.displayAvatarURL())
      .setDescription("Ping?")
      .setColor("YELLOW");

    const m = await interaction.followUp({ embeds: [embed] });

    let embedEdit = new Discord.MessageEmbed()
      .setAuthor("Ping", this.client.user.displayAvatarURL())
      .setDescription(`Pong!
**Bot Uptime ·** ${this.client.utils.formatVreme(this.client.uptime)}
**Latency ·** ${m.createdTimestamp - interaction.createdTimestamp}ms
**API Latency ·** ${this.client.ws.ping}ms`)
      .setColor("BLURPLE");

    m.edit({ embeds: [embedEdit] });
  }
};