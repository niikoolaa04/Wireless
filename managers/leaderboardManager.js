const { MessageEmbed } = require("discord.js");
const User = require("../models/User.js");
const Guild = require("../models/Guild.js");

const updateLb = async (client, guild) => {
  let settings = await Guild.findOne({ id: guild.id });
  if(!settings) return;
  if(!settings.live.channel || !settings.live.message) return;
  let channel = client.channels.cache.get(settings.live.channel);
  if(channel == undefined || channel == null) {
    await Guild.findOneAndUpdate({ id: guild.id }, { $unset: { "live.$.channel": 1, "live.$.message": 1 }}, { new: true, upsert: true });
    return;
  }
  let message = channel.messages.fetch(settings.live.message); 
  if(message == undefined || message == null) {
    await Guild.findOneAndUpdate({ id: guild.id }, { $unset: { "live.$.channel": 1, "live.$.message": 1 }}, { new: true, upsert: true });
    return;
  }

  let invites = await User.find({ guild: guild.id }).lean();
  invites = invites.map((x) =>{
    return {
      user: x.user,
      value: x.invitesRegular
    }
  }).sort((a, b) => b.value - a.value);
    
  let content = "";
  
  for(let i = 0; i < invites.length; i++) {
    if(i == 10) break;
    let user = client.users.cache.get(invites[i].user);
    if (user == undefined) user = "Unknown User";
    else user = user.username;
    
    content += `> \`#${i + 1}\` ${user} - **${invites[i].value}**\n`;
  }
  
  if(invites.length == 0) content = `> Leaderboard is Empty`;
  
  channel.messages.fetch(live.message).then(async (m) => {
    let embed = new MessageEmbed()
      .setTitle("👑・Live Invites")
      .setDescription(`Live Leaderboard is Updated every 10 minutes.`)
      .addField("🎫・Leaderboard", content)
      .setFooter({ text: "Updated at", iconURL: client.user.displayAvatarURL() })
      .setThumbnail(guild.iconURL())
      .setColor("BLURPLE")
      .setTimestamp();
    
    m.edit({ embeds: [embed] }); 
  })
}

module.exports = {
  updateLb, 
}
