const db = require("quick.db");

function giveawayObject(guild, messageID, time, channel, winners, messages, invites, ending, hoster, prize) {
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
    c => (content += `\`${c.name}\``)
  );
  
  return content;
}

module.exports = {
  giveawayObject, 
  commandsList, 
  capitalizeFirstLetter, 
  
}