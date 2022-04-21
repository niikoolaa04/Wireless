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
      .setAuthor({ name: "Ping & Uptime", iconURL: this.client.user.displayAvatarURL() })
      .setDescription("Ping?")
      .setColor("BLURPLE");

    const m = await message.channel.send({ embeds: [embed] });

    let embedEdit = new Discord.MessageEmbed()
      .setAuthor({ name: "Ping & Uptime", iconURL: this.client.user.displayAvatarURL() })
      .setDescription(`Bot is online for **${this.client.utils.formatTime(this.client.uptime)}**, latency **${m.createdTimestamp - message.createdTimestamp}ms**, API latency **${this.client.ws.ping}ms**.`)
      .setColor("BLURPLE");

    m.edit({ embeds: [embedEdit] });
  }
  async slashRun(interaction, args) {
    await interaction.deferReply().catch(() => {});
    let embed = new Discord.MessageEmbed()
      .setAuthor({ name: "Ping & Uptime", iconURL: this.client.user.displayAvatarURL() })
      .setDescription("Ping?")
      .setColor("BLURPLE");

    const m = await interaction.followUp({ embeds: [embed] });

    let embedEdit = new Discord.MessageEmbed()
      .setAuthor({ name: "Ping & Uptime", iconURL: this.client.user.displayAvatarURL() })
      .setDescription(`Bot is online for **${this.client.utils.formatTime(this.client.uptime)}**, latency **${m.createdTimestamp - interaction.createdTimestamp}ms**, API latency **${this.client.ws.ping}ms**.`)
      .setColor("BLURPLE");

    m.edit({ embeds: [embedEdit] });
  }
};
