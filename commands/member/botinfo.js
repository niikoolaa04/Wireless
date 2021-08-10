const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Topgg = require('@top-gg/sdk');

module.exports = class Botinfo extends Command {
  constructor(client) {
    super(client, {
      name: "botinfo",
      description: "Informations about bot",
      usage: "botinfo",
      permissions: [],
      category: "member",
      listed: true,
      slash: true,
    });
  }

  async run(message, args) {
    const memory = process.memoryUsage().heapUsed / 1024 / 1024;
    const api = new Topgg.Api(process.env.TOP_GG_TOKEN);
    let votes = await api.getVotes();

    let embed = new Discord.MessageEmbed()
      .setAuthor("Bot Informations", this.client.user.displayAvatarURL())
      .setDescription(`\`👤\` Developer: <@${this.client.config.developer.id}>
\`🤖\` Bot Version: \`${this.client.config.version}\`
\`⭐\` Guilds: \`${this.client.guilds.cache.size}\`
\`💎\` Top.gg Votes: \`${votes.length}\`
\`📚\` Programming Language: \`JavaScript\`
\`🎮\` Library: \`discord.js\`
\`🖥️\` Memory: \`${memory.toFixed(2)}MB\``)
      .setColor("BLURPLE");
  
    message.channel.send({ embeds: [embed] });
  }
  async slashRun(interaction, args) {
    const memory = process.memoryUsage().heapUsed / 1024 / 1024;
    const api = new Topgg.Api(process.env.TOP_GG_TOKEN);
    let votes = await api.getVotes();
    let embed = new Discord.MessageEmbed()
      .setAuthor("Bot Informations", this.client.user.displayAvatarURL())
      .setDescription(`\`👤\` Developer: <@${this.client.config.developer.id}>
\`🤖\` Bot Version: \`${this.client.config.version}\`
\`⭐\` Guilds: \`${this.client.guilds.cache.size}\`
\`💎\` Top.gg Votes: \`${votes.length}\`
\`📚\` Programming Language: \`JavaScript\`
\`🎮\` Library: \`discord.js\`
\`🖥️\` Memory: \`${memory.toFixed(2)}MB\``)
      .setColor("BLURPLE");
  
    interaction.followUp({ embeds: [embed] });
  }
};