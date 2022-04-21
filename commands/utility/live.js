const Command = require("../../structures/Command");
const Discord = require('discord.js');
const User = require("../../models/User");
const Guild = require("../../models/Guild.js");

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
    let guildData = await Guild.findOne({ id: message.guild.id });

    if (guildData.live.channel) {
      await Guild.findOneAndUpdate({ id: message.guild.id }, { $unset: { "live.$.channel": 1, "live.$.message": 1 }}, { new: true, upsert: true });

      message.channel.send({ embeds: [this.client.embedBuilder(this.client, message.author, "Live Leaderboard", "Live Leaderboard have been removed from Database, you can delete Embed now.", "YELLOW")] })
    } else {
      let leaderboard = await User.find({ guild: message.guild.id }).lean();
      leaderboard = leaderboard.map((x) =>{
        return {
          user: x.user,
          value: x.invitesRegular
        }
      }).sort((a, b) => b.value - a.value);

      let content = "";

      for (let i = 0; i < invites.length; i++) {
        if (i == 10) break;
        let user = this.client.users.cache.get(invites[i].user);
        if (user == undefined) user = "Unknown User";
        else user = user.username;

        content += `> \`#${i + 1}\` ${user} - **${invites[i].value}**\n`;
      }
      
      if(invites.length == 0) content = `> Leaderboard is Empty`;

      let embed = new Discord.MessageEmbed()
        .setTitle("👑・Live Invites")
        .setDescription(`Live Leaderboard is Updated every 10 minutes.`)
        .addField("🎫・Leaderboard", content)
        .setFooter({ text: "Updated at", iconURL: this.client.user.displayAvatarURL() })
        .setThumbnail(message.guild.iconURL())
        .setColor("BLURPLE")
        .setTimestamp();

      message.channel.send({ embeds: [embed] }).then(async (m) => {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, {"live.$.channel": m.channelId, "live.$.message": m.id }, { new: true, upsert: true });
      });
    }
  }
  async slashRun(interaction, args) {
    let guildData = await Guild.findOne({ id: interaction.guild.id });

    if (guildData.live.channel) {
      await Guild.findOneAndUpdate({ id: interaction.guild.id }, { $unset: { "live.$.channel": 1, "live.$.message": 1 }}, { new: true, upsert: true });
      interaction.reply({ embeds: [this.client.embedBuilder(this.client, interaction.user, "Live Leaderboard", "Live Leaderboard have been removed from Database, you can delete Embed now.", "YELLOW")] })
    } else {
      let leaderboard = await User.find({ guild: interaction.guild.id }).lean();
      leaderboard = leaderboard.map((x) =>{
        return {
          user: x.user,
          value: x.invitesRegular
        }
      }).sort((a, b) => b.value - a.value);

      let content = "";

      for (let i = 0; i < invites.length; i++) {
        if (i == 10) break;
        let user = this.client.users.cache.get(invites[i].user);
        if (user == undefined) user = "Unknown User";
        else user = user.username;

        content += `> \`#${i + 1}\` ${user} - **${invites[i].value}**\n`;
      }

      if (invites.length == 0) content = `> Leaderboard is Empty`;

      let embed = new Discord.MessageEmbed()
        .setTitle("👑・Live Invites")
        .setDescription(`Live Leaderboard is Updated every 10 minutes.`)
        .addField("🎫・Leaderboard", content)
        .setFooter({ text: "Updated at", iconURL: this.client.user.displayAvatarURL() })
        .setThumbnail(interaction.guild.iconURL())
        .setColor("BLURPLE")
        .setTimestamp();

      interaction.reply({ content: "> Live Leaderboard have been created successfully.", ephemeral: true  });
      interaction.channel.send({ embeds: [embed] }).then(async (m) => {
        await Guild.findOneAndUpdate({ id: interaction.guild.id }, {"live.$.channel": m.channelId, "live.$.message": m.id }, { new: true, upsert: true });
      });
    }
  }
};
