const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("pretty-ms");
const random = require("random");
const delay = require("delay");

const startGiveaway = async (client, message, gwObject) => {
  let reqContent = "";
  if(gwObject.requirements.messagesReq > 0 || gwObject.requirements.invitesReq > 0) reqContent += `\n**${client.emojisConfig.tasks} Requirements**`;
  if(gwObject.requirements.messagesReq > 0) reqContent += `\n> **›** You need **${gwObject.requirements.messagesReq}** Message(s) to Enter Giveaway.`;
  if(gwObject.requirements.invitesReq > 0) reqContent += `\n> **›** You need **${gwObject.requirements.invitesReq}** Invite(s) to Enter Giveaway.`;
  
  let startEmbed = new Discord.MessageEmbed()
    .setTitle(`🎁︲New Giveaway`)
    .setDescription(`
**${client.emojisConfig.prize} About Giveaway**
> **Reward:** ${gwObject.prize}
> **Time Remaining:** ${client.utils.formatVreme(gwObject.duration)}
> **Number of Winners:** ${gwObject.winnerCount}
${reqContent}

[Invite Me](${client.config.links.inviteURL}) | [Support Server](${client.config.links.supportServer})`)
    .setColor("BLURPLE")
    .setThumbnail(message.guild.iconURL())
    .setFooter("Ends at", client.user.displayAvatarURL())
    .setTimestamp(gwObject.endsAt);
  
  let channel = client.channels.cache.get(gwObject.channelID);
  
  let m = await channel.send({embed: startEmbed});
  await m.react("🎉");
  
  gwObject.messageID = m.id;
  db.push(`giveaways_${message.guild.id}`, gwObject);
}

const editGiveaway = async (client, message, messageID, guild, msgReq, invReq, winners, ending, prize) => {
  let giveaways = db.fetch(`giveaways_${message.guild.id}`);
  let gwData = giveaways.find(g => g.messageID == messageID && g.ended == false);
  
  let channel = client.channels.cache.get(gwData.channelID);
  let msg = await channel.messages.fetch(gwData.messageID);
  
  if(msgReq == "none") msgReq = gwData.requirements.messagesReq;
  if(invReq == "none") invReq = gwData.requirements.invitesReq;
  if(winners == "none") winners = gwData.winnerCount;
  if(prize == "none") prize = gwData.prize;
  if(ending == "none") ending = gwData.duration;
  else ending = gwData.endsAt + ending;
  
  let newObject = client.utils.giveawayObject(
    gwData.guildID,
    gwData.messageID,
    gwData.duration,
    gwData.channelID,
    winners,
    msgReq,
    invReq,
    ending,
    gwData.hostedBy,
    prize
  );

  const newData = giveaways.filter((giveaway) => giveaway.messageID != gwData.messageID);

  newData.push(newObject);

  db.set(`giveaways_${guild.id}`, newData);
  
  delay(1000);
  client.gw.checkGiveaway(client, message.guild);
}

const endGiveaway = async (client, message, messageID, guild) => {
  let giveaways = db.fetch(`giveaways_${message.guild.id}`);
  let gwData = giveaways.find(g => g.messageID == messageID && g.ended == false);
  
  let channel = client.channels.cache.get(gwData.channelID);
  let msg = await channel.messages.fetch(gwData.messageID);
    
  let rUsers = await msg.reactions.cache.get("🎉").users.fetch();
  let rFilter = rUsers.filter(r => !r.bot);

  let rArray = rFilter.array();
  let randomWinner;
  let winners = [];
  
  for(let j = 0; j < gwData.winnerCount 
  ; j++) {
    if(gwData.winnerCount > 1 && rArray.length < 2) {
      randomWinner = rArray[0];
      winners.push(randomWinner);
      rArray.splice(rArray.indexOf(randomWinner), 1);
      break;
    } else {
      randomWinner = rArray[~~(Math.random() * rArray.length)]; 
      winners.push(randomWinner);
      rArray.splice(rArray.indexOf(randomWinner), 1);
    }
  }

  let newObject = client.utils.giveawayObject(
    gwData.guildID,
    gwData.messageID,
    "Završen",
    gwData.channelID,
    gwData.winnerCount,
    gwData.requirements.messagesReq,
    gwData.requirements.invitesReq,
    "Završen",
    gwData.hostedBy,
    gwData.prize
  );
  newObject.winners.push(winners);
  newObject.ended = true;

  const newData = giveaways.filter((giveaway) => giveaway.messageID != gwData.messageID);

  newData.push(newObject);

  db.set(`giveaways_${guild.id}`, newData);

  let reqContent = "";
  if (gwData.requirements.messagesReq > 0 || gwData.requirements.invitesReq > 0) reqContent += `\n**${client.emojisConfig.tasks} Requirements**`;
  if (gwData.requirements.messagesReq > 0) reqContent += `\n> **›** You need **${gwData.requirements.messagesReq}** Message(s) to Enter Giveaway.`;
  if (gwData.requirements.invitesReq > 0) reqContent += `\n> **›** You need **${gwData.requirements.invitesReq}** Invite(s) to Enter Giveaway.`;

  let editEmbed = new Discord.MessageEmbed()
    .setTitle(`🎁︲Giveaway Ended`)
    .setDescription(`
**${client.emojisConfig.prize} About Giveaway**
> **Reward:** ${gwData.prize}
> **Time Remaining:** Ended
> **Number of Winners:** ${gwData.winnerCount}
> **Winner(s):** ${randomWinner ? winners : "No Winner(s)"}
${reqContent}

[Invite Me](${client.config.links.inviteURL}) | [Support Server](${client.config.links.supportServer})`)
    .setColor("RED")
    .setThumbnail(message.guild.iconURL())
    .setFooter("Ended", client.user.displayAvatarURL())
    .setTimestamp();

  msg.edit({ embed: editEmbed });
  
  let hasWinners = `\`🎊\` Congratulations to ${gwData.winnerCount > 1 ? "winners" : "winner"} ${winners} on winning this Giveaway!\nGood Luck to the others next time.`;
  let noWinners = `\`🎊\` Giveaway ended but there is no winner(s).`;

  let endEmbed = new Discord.MessageEmbed()
    .setTitle("🎁︲Giveaway")
    .setDescription(`${randomWinner ? hasWinners : noWinners}`)
    .setColor("YELLOW");
  
  channel.send(endEmbed);
}

const rerollGiveaway = async (client, message, messageID) => {
  let giveaways = db.fetch(`giveaways_${message.guild.id}`);
  let gwData = giveaways.find(g => g.messageID == messageID && g.ended == true);
  
  let channel = client.channels.cache.get(gwData.channelID);
  let msg = await channel.messages.fetch(gwData.messageID);
    
  let rUsers = await msg.reactions.cache.get("🎉").users.fetch();
  let rFilter = rUsers.filter(r => !r.bot);

  let rArray = rFilter.array();
  let winners = [];
  
  for(let i = 0; i < gwData.winnerCount; i++) {
    if(gwData.winnerCount > 1 && rArray.length < 2) {
      randomWinner = rArray[0];
      winners.push(randomWinner);
      rArray.splice(rArray.indexOf(randomWinner), 1);
      break;
    } else {
      randomWinner = rArray[~~(Math.random() * rArray.length)]; 
      winners.push(randomWinner);
      rArray.splice(rArray.indexOf(randomWinner), 1);
    }
  }
  
  let winnerString = `\`🎊\` ${gwData.winnerCount > 1 ? "New Winners have been choosen" : "New Winner have been choosen"} ${winners}, congratulations on winning this Giveaway!\nGood Luck to the others next time.`;
      
  let rerollEmbed = new Discord.MessageEmbed()
    .setTitle("🎁︲Giveaway")
    .setDescription(`${winnerString}`)
    .setColor("BLURPLE");
  
  channel.send({ embed: rerollEmbed })
}

const checkGiveaway = async (client, guild) => {
  let giveaways = db.fetch(`giveaways_${guild.id}`);
  if(giveaways == null) return;
  if(giveaways.length == 0) return;
  
  for(let i = 0; i < giveaways.length; i++) {
    if(giveaways[i].ended == true) continue;
    
    let channel = client.channels.cache.get(giveaways[i].channelID);
    let msg = await channel.messages.fetch(giveaways[i].messageID);
    
    let rUsers = await msg.reactions.cache.get("🎉").users.fetch();
    let rFilter = rUsers.filter(r => !r.bot);
    let rArray = rFilter.array();
    let randomWinner;
    let winners = [];
    
    if(Date.now() > giveaways[i].endsAt) {
      for(let j = 0; j < giveaways[i].winnerCount; j++) {
        if(giveaways[i].winnerCount > 1 && rArray.length < 2) {
          randomWinner = rArray[0];
          winners.push(randomWinner);
          rArray.splice(rArray.indexOf(randomWinner), 1);
          break;
        } else {
          randomWinner = rArray[~~(Math.random() * rArray.length)]; 
          winners.push(randomWinner);
          rArray.splice(rArray.indexOf(randomWinner), 1);
        }
      }
      
      let newObject = client.utils.giveawayObject(
        giveaways[i].guildID,
        giveaways[i].messageID, 
        "Završen", 
        giveaways[i].channelID, 
        giveaways[i].winnerCount, 
        giveaways[i].requirements.messagesReq, 
        giveaways[i].requirements.invitesReq, 
        "Završen", 
        giveaways[i].hostedBy, 
        giveaways[i].prize
      );
      newObject.winners.push(winners);
      newObject.ended = true;
      
      const newData = giveaways.filter((giveaway) => giveaway.messageID != giveaways[i].messageID);
      
      newData.push(newObject);
      
      db.set(`giveaways_${guild.id}`, newData);
      
      let reqContent = "";
      if(giveaways[i].requirements.messagesReq > 0 || giveaways[i].requirements.invitesReq > 0) reqContent += `\n**${client.emojisConfig.tasks} Requirements**`;
      if(giveaways[i].requirements.messagesReq > 0) reqContent += `\n> **›** You need **${giveaways[i].requirements.messagesReq}** Message(s) to Enter Giveaway.`;
      if(giveaways[i].requirements.invitesReq > 0) reqContent += `\n> **›** You need **${giveaways[i].requirements.invitesReq}** Invite(s) to Enter Giveaway.`;

      let editEmbed = new Discord.MessageEmbed()
        .setTitle(`🎁︲Giveaway Ended`)
        .setDescription(`
**${client.emojisConfig.prize} About Giveaway**
> **Reward:** ${giveaways[i].prize}
> **Time Remaining:** Ended
> **Number of Winners:** ${giveaways[i].winnerCount}
> **Winner(s):** ${randomWinner ? winners : "No Winner(s)"}
${reqContent}

[Invite Me](${client.config.links.inviteURL}) | [Support Server](${client.config.links.supportServer})`)
        .setColor("RED")
        .setThumbnail(guild.iconURL())
        .setFooter("Ended", client.user.displayAvatarURL())
        .setTimestamp();
      
      msg.edit({ embed: editEmbed });
      
      let hasWinners = `\`🎊\` Congratulations to ${giveaways[i].winnerCount > 1 ? "winners" : "winner"} ${winners} on winning this Giveaway!\nGood Luck to the others next time.`;
      let noWinners = `\`🎊\` Giveaway ended but there is no winner(s).`;
      
      let endEmbed = new Discord.MessageEmbed()
        .setTitle("🎁︲Giveaway")
        .setDescription(`${randomWinner ? hasWinners : noWinners}`)
        .setColor("YELLOW");
      
      channel.send(endEmbed);
    } else {
      let reqContent = "";
      if(giveaways[i].requirements.messagesReq > 0 || giveaways[i].requirements.invitesReq > 0) reqContent += `\n**${client.emojisConfig.tasks} Requirements**`;
      if(giveaways[i].requirements.messagesReq > 0) reqContent += `\n> **›** You need **${giveaways[i].requirements.messagesReq}** Message(s) to Enter Giveaway.`;
      if(giveaways[i].requirements.invitesReq > 0) reqContent += `\n> **›** You need **${giveaways[i].requirements.invitesReq}** Invite(s) to Enter Giveaway.`;

      let embedChange = new Discord.MessageEmbed()
        .setTitle(`🎁︲New Giveaway`)
        .setDescription(`
**${client.emojisConfig.prize} About Giveaway**
> **Reward:** ${giveaways[i].prize}
> **Time Remaining:** ${client.utils.formatVreme(giveaways[i].endsAt - Date.now())}
> **Number of Winners:** ${giveaways[i].winnerCount}
${reqContent}

[Invite Me](${client.config.links.inviteURL}) | [Support Server](${client.config.links.supportServer})`)
        .setColor("BLURPLE")
        .setThumbnail(guild.iconURL())
        .setFooter("Ends at", client.user.displayAvatarURL())
        .setTimestamp(giveaways[i].endsAt);

      msg.edit({ embed: embedChange });
    }
  } 
}

module.exports = {
  startGiveaway,
  checkGiveaway, 
  endGiveaway,
  editGiveaway, 
  rerollGiveaway,
}