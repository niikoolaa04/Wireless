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
    
    let live = db.fetch(`server_${message.guild.id}_liveLb`);
    
    if(live != null) {
      db.delete(`server_${message.guild.id}_liveLb`);
      message.channel.send({ embeds: [this.client.embedBuilder(this.client, message, "Live Leaderboard", "Live Leaderboard have been removed from Database, you can delete Embed now.", "YELLOW")] })
    } else {
      let invites = db.all().filter(i => i.ID.startsWith(`invitesRegular_${message.guild.id}_`)).sort((a, b) => b.data - a.data);
  
      let content = "";
  
      for (let i = 0; i < invites.length; i++) {
        if (i == 10) break;
        let user = client.users.cache.get(invites[i].ID.split("_")[2]);
        if (user == undefined) user = "Unknown User";
        else user = user.username;
  
        content += `> \`#${i + 1}\` ${user} - **${invites[i].data}**\n`;
      }
  
      let embed = new MessageEmbed()
        .setTitle("👑・Live Invites")
        .setDescription(`Live Leaderboard is Updated every 10 minutes.`)
        .addField("🎫・Leaderboard", content)
        .setFooter("Updated at", this.client.user.displayAvatarURL())
        .setThumbnail(message.guild.iconURL())
        .setColor("BLURPLE")
        .setTimestamp();
  
      message.channel.send({ embeds: [embed] }).then(async (m) => {
        let channelData = {
          channel: m.channelId,
          message: m.id,
        }
  
        db.set(`server_${message.guild.id}_liveLb`, channelData);
      });
    }
  }
};