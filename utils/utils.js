const db = require("quick.db");

function giveawayObject(guild, messageID, time, channel, winners, messages, invites, ending, hoster, prize) {
  let role = db.fetch(`server_${guild.id}_bypassRole`);
  if(role == null) role = "none";
  let gwObject = {
    messageID: messageID,
    guildID: guild, 
    channelID: channel,
    prize: prize,
    duration: time, 
    hostedBy: hoster, 
    winnerCount: winners, 
    requirements: {
      messagesReq: messages, 
      invitesReq: invites, 
    },
    roleBypass: role, 
    ended: false, 
    endsAt: ending,
    winners: []
  }
  
  return gwObject;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function commandsList(client, message, category) {
  let prefix = db.fetch(`settings_${message.guild.id}_prefix`);
  if (prefix === null) prefix = client.config.prefix; 
  let commands = client.commands.filter(
    c => c.category === category && c.listed === true
  );
  let loaded = commands.array();
  let content = "";
  
  loaded.forEach(
    c => (content += `\`${c.name}\`, `)
  );
  
  return content;
}

function formatVreme(ms) {
  let roundNumber = ms > 0 ? Math.floor : Math.ceil;
  let days = roundNumber(ms / 86400000),
  hours = roundNumber(ms / 3600000) % 24,
  mins = roundNumber(ms / 60000) % 60,
  secs = roundNumber(ms / 1000) % 60;
  var time = (days > 0) ? `${days}d ` : "";
  time += (hours > 0) ? `${hours}h ` : "";
  time += (mins > 0) ? `${mins}m ` : "";
  time += (secs > 0) ? `${secs}s` : "0s";
  return time;
}

function lbContent(client, message, lbType) {
  let leaderboard = db
    .all()
    .filter(data => data.ID.startsWith(`${lbType}_${message.guild.id}`))
    .sort((a, b) => b.data - a.data);
  let content = "";
  
  for (let i = 0; i < leaderboard.length; i++) {
    if (i === 10) break;
  
    let user = client.users.cache.get(leaderboard[i].ID.split("_")[2]);
    if (user == undefined) user = "Unknown User";
    else user = user.username;
    content += `\`${i + 1}.\` ${user} - **${leaderboard[i].data}**\n`;
  }
  
  return content;
}

module.exports = {
  giveawayObject, 
  commandsList, 
  capitalizeFirstLetter, 
  formatVreme, 
  lbContent, 
}