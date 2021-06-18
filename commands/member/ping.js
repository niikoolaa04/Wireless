const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class Ping extends Command {
  constructor(client) {
    super(client, {
      name: "ping",
      description: "bot's ping",
      usage: "ping",
      permissions: [],
      category: "utility",
      listed: true,
    });
  }

  async run(message, args) {
    let embed = new Discord.MessageEmbed()
      .setDescription("Ping?")
      .setColor("YELLOW");

    const m = await message.channel.send(embed);

    let embedEdit = new Discord.MessageEmbed()
      .setDescription(`Pong!
Bot Uptime · ${this.client.utils.formatVreme(this.client.uptime)}
Latency · ${m.createdTimestamp - message.createdTimestamp}ms
API Latency · ${this.client.ws.ping}ms`)
      .setColor("BLURPLE");

    m.edit({ embed: embedEdit });
  }
};