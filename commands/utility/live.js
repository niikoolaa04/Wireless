const Command = require("../../structures/Command");
const Discord = require('discord.js');
const db = require("quick.db");

module.exports = class LiveLb extends Command {
  constructor(client) {
    super(client, {
      name: "live",
      description: "Live Leaderboard for Invites",
      usage: "live",
      permissions: ["MANAGE_GUILD"],
      category: "utility",
      listed: true,
      slash: true, 
    }); 
  }

  async run(message, args) {
    let live = db.fetch(`server_${message.guild.id}_liveLb`);

    if (live != null) {
      db.delete(`server_${message.guild.id}_liveLb`);
      message.channel.send({ embeds: [this.client.embedBuilder(this.client, message.author, "Live Leaderboard", "Live Leaderboard have been removed from Database, you can delete Embed now.", "YELLOW")] })
    } else {
      let invites = db.all().filter(i => i.ID.startsWith(`invitesRegular_${message.guild.id}_`)).sort((a, b) => b.data - a.data);

      let content = "";

      for (let i = 0; i < invites.length; i++) {
        if (i == 10) break;
        let user = this.client.users.cache.get(invites[i].ID.split("_")[2]);
        if (user == undefined) user = "Unknown User";
        else user = user.username;

        content += `> \`#${i + 1}\` ${user} - **${invites[i].data}**\n`;
      }
      
      if(invites.length == 0) content = `> Leaderboard is Empty`;

      let embed = new Discord.MessageEmbed()
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
  async slashRun(interaction, args) {
    let live = db.fetch(`server_${interaction.guild.id}_liveLb`);

    if (live != null) {
      db.delete(`server_${interaction.guild.id}_liveLb`);
      interaction.channel.send({ embeds: [this.client.embedBuilder(this.client, interaction.user, "Live Leaderboard", "Live Leaderboard have been removed from Database, you can delete Embed now.", "YELLOW")] })
    } else {
      let invites = db.all().filter(i => i.ID.startsWith(`invitesRegular_${interaction.guild.id}_`)).sort((a, b) => b.data - a.data);

      let content = "";

      for (let i = 0; i < invites.length; i++) {
        if (i == 10) break;
        let user = this.client.users.cache.get(invites[i].ID.split("_")[2]);
        if (user == undefined) user = "Unknown User";
        else user = user.username;

        content += `> \`#${i + 1}\` ${user} - **${invites[i].data}**\n`;
      }

      if (invites.length == 0) content = `> Leaderboard is Empty`;

      let embed = new Discord.MessageEmbed()
        .setTitle("👑・Live Invites")
        .setDescription(`Live Leaderboard is Updated every 10 minutes.`)
        .addField("🎫・Leaderboard", content)
        .setFooter("Updated at", this.client.user.displayAvatarURL())
        .setThumbnail(interaction.guild.iconURL())
        .setColor("BLURPLE")
        .setTimestamp();

      interaction.channel.send({ embeds: [embed] }).then(async (m) => {
        let channelData = {
          channel: m.channelId,
          message: m.id,
        }

        db.set(`server_${interaction.guild.id}_liveLb`, channelData);
      });
    }
  }
};