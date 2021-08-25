const { MessageEmbed } = require("discord.js");
const db = require("quick.db");

const updateLb = async (client, guild) => {
  let live = db.fetch(`server_${guild.id}_liveLb`);
  if(live == null) return;
  let channel = client.channels.cache.get(live.channel);
  if(channel == undefined || channel == null) return db.delete(`server_${guild.id}_liveLb`);
  let message = channel.messages.fetch(live.message); 
  if(message == undefined || message == null) return db.delete(`server_${guild.id}_liveLb`);
  
  let invites = db.all().filter(i => i.ID.startsWith(`invitesRegular_${guild.id}_`)).sort((a, b) => b.data - a.data);
    
  let content = "";
  
  for(let i = 0; i < invites.length; i++) {
    if(i == 10) break;
    let user = client.users.cache.get(invites[i].ID.split("_")[2]);
    if (user == undefined) user = "Unknown User";
    else user = user.username;
    
    content += `> \`#${i + 1}\` ${user} - **${invites[i].data}**\n`;
  }
  
  channel.messages.fetch(live.message).then(async (m) => {
    let embed = new MessageEmbed()
      .setTitle("👑・Live Invites")
      .setDescription(`Live Leaderboard is Updated every 10 minutes.`)
      .addField("🎫・Leaderboard", content)
      .setFooter("Updated at", client.user.displayAvatarURL())
      .setThumbnail(guild.iconURL())
      .setColor("BLURPLE")
      .setTimestamp();
    
    m.edit({ embeds: [embed] }); 
  })
}

module.exports = {
  updateLb, 
}