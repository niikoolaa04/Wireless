const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

const updateLb = async (client, guild) => {
  let live = db.fetch(`server_${guild.id}_liveLb`);
  if(live == null) return;
  let channel = client.channels.cache.get(live.channel);
  if(channel == undefined || channel == null) return db.delete(`server_${guild.id}_liveLb`);
  let message = channel.messages.fetch(live.message); 
  if(message == undefined || message == null) return db.delete(`server_${guild.id}_liveLb`);
  
  let usersContent = "#3 Nikola"
  
  let embed = new MessageEmbed()
    .setTitle("👑・Live Invites")
    .setDescription(`Live Leaderboard is Updated every 10 minutes.`)
    .addField("🎫・Leaderboard", usersContent)
    .setFooter("Updated at", this.client.user.displayAvatarURL())
    .setColor("BLURPLE")
    .setTimestamp();
  
  message.edit({ embeds: [embed] });
}

module.exports = {
  updateLb, 
}