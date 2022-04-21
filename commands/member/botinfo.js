const Command = require("../../structures/Command");
const Discord = require("discord.js");
// const Topgg = require('@top-gg/sdk');

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
/*     const api = new Topgg.Api(process.env.TOP_GG_TOKEN);
    let votes = await api.getVotes(); */

    let embed = new Discord.MessageEmbed()
      .setAuthor({ name: "Bot Informations", iconURL: this.client.user.displayAvatarURL() })
      .setDescription(`Wireless is Advanced Giveaways Bot featuring Giveaway Requirements, Interactive Giveaway Creation, Messages & Invites Counter and more.`)
      .addField(`Developer`, `<@${this.client.config.developer.id}>`, true)
      .addField(`Version`, `${this.client.config.version}`, true)
      .addField(`Library`, `discord.js`, true)
      .addField(`Memory`, `${memory.toFixed(2)}MB`, true)
      // .addField(`Top.gg Votes`, `\`${votes.length}\``, true)
      .addField(`Guild Count`, `\`${this.client.guilds.cache.size}\``, true)
      .addField(`Member Count`, `\`${this.client.users.cache.size}\``, true)
      .addField(`Vote Link`, `[Click Here to Get Vote Link](${this.client.config.links.voteURL})`, true)
      .addField(`Invite Link`, `[Click Here to Get Invite Link](${this.client.config.links.inviteURL})`, true)
      // .addField(`Website Link`, `[Click Here to Get Website Link](${this.client.config.links.website})`, true)
      .setColor("BLURPLE");
  
    message.channel.send({ embeds: [embed] });
  }
  async slashRun(interaction, args) {
    const memory = process.memoryUsage().heapUsed / 1024 / 1024;
    const api = new Topgg.Api(process.env.TOP_GG_TOKEN);
    let votes = await api.getVotes();
    let embed = new Discord.MessageEmbed()
      .setAuthor({ name: "Bot Informations", iconURL: this.client.user.displayAvatarURL() })
      .setDescription(`Wireless is Advanced Giveaways Bot featuring Giveaway Requirements, Invites Tracking, Messages & Invites Counter and more.`)
      .addField(`Developer`, `<@${this.client.config.developer.id}>`, true)
      .addField(`Version`, `${this.client.config.version}`, true)
      .addField(`Library`, `discord.js`, true)
      .addField(`Memory`, `${memory.toFixed(2)}MB`, true)
      .addField(`Guild Count`, `\`${this.client.guilds.cache.size}\``, true)
      .addField(`Member Count`, `\`${this.client.users.cache.size}\``, true)
      .addField(`Top.gg Votes`, `\`${votes.length}\``, true)
      .addField(`Vote Link`, `[Click Here to Get Vote Link](${this.client.config.links.voteURL})`, true)
      .addField(`Invite Link`, `[Click Here to Get Invite Link](${this.client.config.links.inviteURL})`, true)
      // .addField(`Website Link`, `[Click Here to Get Website Link](${this.client.config.links.website})`, true)
      .setColor("BLURPLE");
  
    interaction.reply({ embeds: [embed] });
  }
};
