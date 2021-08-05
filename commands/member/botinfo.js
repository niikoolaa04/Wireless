const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class Botinfo extends Command {
  constructor(client) {
    super(client, {
      name: "botinfo",
      description: "informations about bot",
      usage: "botinfo",
      permissions: [],
      category: "utility",
      listed: true,
    });
  }

  async run(message, args) {
    const memory = process.memoryUsage().heapUsed / 1024 / 1024;
    let embed = new Discord.MessageEmbed()
      .setAuthor("Bot Informations", this.client.user.displayAvatarURL())
      .setDescription(`\`👤\` Developer: <@${this.client.config.dev.id}>
\`🤖\` Bot Version: \`${this.client.config.version}\`
\`⭐\` Guilds: \`${this.client.guilds.cache.size}\`
\`📚\` Programming Language: \`JavaScript\`
\`🎮\` Library: \`discord.js\`
\`🖥️\` Memory: \`${memory.toFixed(2)}MB\``)
      .setColor("BLURPLE");
  
    message.channel.send({ embeds: [embed] });
  }
};