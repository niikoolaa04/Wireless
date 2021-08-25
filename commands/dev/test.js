const Command = require("../../structures/Command");
const Discord = require('discord.js');
const db = require("quick.db");

module.exports = class Test extends Command {
  constructor(client) {
    super(client, {
      name: "test",
      description: "Command for Testing",
      usage: "test",
      permissions: [],
      category: "dev",
      listed: false,
    });
  }

  async run(message, args) {
    var allowedToUse = false;
    this.client.dev_ids.forEach(id => {
      if (message.author.id == id) allowedToUse = true;
    });
    if (!allowedToUse) return;
    let usersContent = `#1 Nikola`
    let embed = new MessageEmbed()
      .setTitle("👑・Live Invites")
      .setDescription(`Live Leaderboard is Updated every 10 minutes.`)
      .addField("🎫・Leaderboard", usersContent)
      .setFooter("Updated at", this.client.user.displayAvatarURL())
      .setColor("BLURPLE")
      .setTimestamp();
      
    message.channel.send({ embeds: [embed] }).then(async (m) => {
      let channelData = {
        channel: m.channelId, 
        message: m.id, 
        guild: m.guildId
      }
      
      db.set(`server_${message.guild.id}_liveLb`, channelData); 
    });
  }
};