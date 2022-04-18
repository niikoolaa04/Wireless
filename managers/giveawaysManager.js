const Discord = require("discord.js");
const db = require("quick.db");
const ms = require("ms");
const delay = require("delay");

const startGiveaway = async (client, message, gwObject) => {
  let reqContent = "";
  let roleReq = db.fetch(`server_${message.guild.id}_roleReq`);
  if(gwObject.requirements.messagesReq > 0 || gwObject.requirements.invitesReq > 0 || roleReq != null) reqContent += `\n**${client.emojisConfig.tasks} Requirements**`;
  if(gwObject.requirements.messagesReq > 0) reqContent += `\n> **›** You need **${gwObject.requirements.messagesReq}** Message(s) to Enter Giveaway.`;
  if(gwObject.requirements.invitesReq > 0) reqContent += `\n> **›** You need **${gwObject.requirements.invitesReq}** Invite(s) to Enter Giveaway.`;
  if(roleReq) reqContent += `\n> **›** You need **<@&${roleReq}>** Role to Enter Giveaway.`;
  
  let startEmbed = new Discord.MessageEmbed()
    .setAuthor({ name: "New Giveaway", iconURL: client.user.displayAvatarURL() })
    .setDescription(`
**${client.emojisConfig.prize} About Giveaway**
> **${client.emojisConfig.reward} Reward:** ${gwObject.prize}
> **${client.emojisConfig.hoster} Hosted by:** <@${gwObject.hostedBy}>
> **${client.emojisConfig.timer} Time Remaining:** ${client.utils.formatTime(gwObject.duration)}
> **${client.emojisConfig.members} Number of Winners:** ${gwObject.winnerCount}
${reqContent}

[Invite Me](${client.config.links.inviteURL}) | [Vote for me](${client.config.links.voteURL}) | [Website](${client.config.links.website}) | [Support Server](${client.config.links.supportServer})`)
    .setColor("BLURPLE")
    .setThumbnail(message.guild.iconURL())
    .setFooter({ text: "Ends at", iconURL: client.user.displayAvatarURL() })
    .setTimestamp(gwObject.endsAt);
  
  let channel = client.channels.cache.get(gwObject.channelID);
  
  let customEmoji = db.fetch(`server_${message.guild.id}_customReaction`) || "🎉";

  let m = await channel.send({embeds: [startEmbed]});
  await m.react(customEmoji);
    
  gwObject.messageID = m.id;
  db.push(`giveaways_${message.guild.id}`, gwObject);
}

const editGiveaway = async (client, message, messageID, guild, msgReq, invReq, winners, ending, prize) => {
  let giveaways = db.fetch(`giveaways_${message.guild.id}`);
  let gwData = giveaways.find(g => g.messageID == messageID && g.ended == false);
  
  let channel = client.channels.cache.get(gwData.channelID);
  let msg = await channel.messages.fetch(gwData.messageID);
  
  if(ending != 0 && ending != "none") ending = ms(ending);
  
  if(msgReq == "none" || msgReq == 0) msgReq = 0;
  if(invReq == "none" || invReq == 0) invReq = 0;
  if(winners == "none" || winners == 0) winners = gwData.winnerCount;
  if(prize == "none" || prize == 0) prize = gwData.prize;
  
  if(ending == "none" || ending == 0) { 
    ending = gwData.endsAt;
  } else {
    ending = gwData.endsAt + ending;
  }
  
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
  await client.gw.checkGiveaway(client, message.guild);
}

const endGiveaway = async (client, message, messageID, guild) => {
  let giveaways = db.fetch(`giveaways_${message.guild.id}`);
  let gwData = giveaways.find(g => g.messageID == messageID && g.ended == false);
  
  let channel = client.channels.cache.get(gwData.channelID);
  let msg = await channel.messages.fetch(gwData.messageID);
    
  let customEmoji = db.fetch(`server_${message.guild.id}_customReaction`) || "🎉";
  let rUsers = await msg.reactions.cache.get(customEmoji).users.fetch();
  let rFilter = rUsers.filter(r => !r.bot);

  let rArray = [...rFilter.values()];
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
    "Ended",
    gwData.channelID,
    gwData.winnerCount,
    gwData.requirements.messagesReq,
    gwData.requirements.invitesReq,
    "Ended",
    gwData.hostedBy,
    gwData.prize
  );
  newObject.winners.push(winners);
  newObject.ended = true;

  const newData = giveaways.filter((giveaway) => giveaway.messageID != gwData.messageID);

  newData.push(newObject);

  db.set(`giveaways_${guild.id}`, newData);

  let reqContent = "";
  let roleReq = db.fetch(`server_${message.guild.id}_roleReq`);
  if (gwData.requirements.messagesReq > 0 || gwData.requirements.invitesReq > 0 || roleReq != null) reqContent += `\n**${client.emojisConfig.tasks} Requirements**`;
  if (gwData.requirements.messagesReq > 0) reqContent += `\n> **›** You need **${gwData.requirements.messagesReq}** Message(s) to Enter Giveaway.`;
  if (gwData.requirements.invitesReq > 0) reqContent += `\n> **›** You need **${gwData.requirements.invitesReq}** Invite(s) to Enter Giveaway.`;
  if (roleReq) reqContent += `\n> **›** You need **<@&${roleReq}>** Role to Enter Giveaway.`;

  let editEmbed = new Discord.MessageEmbed()
    .setAuthor({ name: "Giveaway Ended", iconURL: client.user.displayAvatarURL() })
    .setDescription(`
**${client.emojisConfig.prize} About Giveaway**
> **${client.emojisConfig.reward} Reward:** ${gwData.prize}
> **${client.emojisConfig.hoster} Hosted by:** <@${gwData.hostedBy}>
> **${client.emojisConfig.timer} Time Remaining:** Ended
> **${client.emojisConfig.members} Number of Winners:** ${gwData.winnerCount}
> **${client.emojisConfig.winners} Winner(s):** ${randomWinner ? winners : "No Winner(s)"}
${reqContent}

[Invite Me](${client.config.links.inviteURL}) | [Vote for me](${client.config.links.voteURL}) | [Website](${client.config.links.website}) | [Support Server](${client.config.links.supportServer})`)
    .setColor("RED")
    .setThumbnail(message.guild.iconURL())
    .setFooter({ text: "Ended", iconURL: client.user.displayAvatarURL() })
    .setTimestamp();

  msg.edit({ embeds: [editEmbed] });
  
  db.delete(`server_${message.guild.id}_roleReq`);

  let hasWinners = `\`🎊\` Congratulations to ${gwData.winnerCount > 1 ? "winners" : "winner"} ${winners} on winning this Giveaway!\nGood Luck to the others next time.`;
  let noWinners = `\`🎊\` Giveaway ended but there is no winner(s).`;

  let endEmbed = new Discord.MessageEmbed()
    .setTitle("🎁・Giveaway")
    .setDescription(`${randomWinner ? hasWinners : noWinners}`)
    .setColor("YELLOW");
  
  channel.send({ embeds: [endEmbed] });

  let dmStatus = db.fetch(`server_${message.guild.id}_dmWinners`);
  const dmWin = new Discord.MessageEmbed()
    .setTitle("🎁・Giveaway")
    .setDescription(`\`👑\` Congratulations, you have Won Giveaway in **${message.guild.name}**!

>>> **\`🎊\` Giveaway:** ${gwData.prize}`)
    .setColor("YELLOW");
  if(randomWinner && dmStatus != null) winners.forEach((u) => u.send({ embeds: [dmWin] }));
}

const rerollGiveaway = async (client, message, messageID) => {
  let giveaways = db.fetch(`giveaways_${message.guild.id}`);
  let gwData = giveaways.find(g => g.messageID == messageID && g.ended == true);
  
  let channel = client.channels.cache.get(gwData.channelID);
  let msg = await channel.messages.fetch(gwData.messageID);
    
  let customEmoji = db.fetch(`server_${message.guild.id}_customReaction`) || "🎉";
  let rUsers = await msg.reactions.cache.get(customEmoji).users.fetch();
  let rFilter = rUsers.filter(r => !r.bot);

  let rArray = [...rFilter.values()];
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
    .setTitle("🎁・Giveaway")
    .setDescription(`${winnerString}`)
    .setColor("BLURPLE");
  
  channel.send({ embeds: [rerollEmbed] })
}

const checkGiveaway = async (client, guild) => {
  let giveaways = db.fetch(`giveaways_${guild.id}`) || [];
  if(giveaways == null) return;
  if(giveaways.length == 0) return;
  
  for(let i = 0; i < giveaways.length; i++) {
    if(giveaways[i].ended == true) continue;
    
    let removed = false;
    let channel = client.channels.cache.get(giveaways[i].channelID);
    if(channel == undefined) {
      const cData = giveaways.filter((giveaway) => giveaway.messageID != giveaways[i].messageID);
      db.set(`giveaways_${giveaways[i].guildID}`, cData);
      removed = true;
    }
    
    let msg = await channel.messages.fetch(giveaways[i].messageID).catch(async (err) => {
      const mData = giveaways.filter((giveaway) => giveaway.messageID != giveaways[i].messageID);
      db.set(`giveaways_${giveaways[i].guildID}`, mData);
      removed = true;
    });
    
    if(removed == true) continue;
    
    let customEmoji = db.fetch(`server_${guild.id}_customReaction`) || "🎉";
    let rUsers = await msg.reactions.cache.get(customEmoji).users.fetch();
    let rFilter = rUsers.filter(r => !r.bot);
    let rArray = [...rFilter.values()];
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
        "Ended", 
        giveaways[i].channelID, 
        giveaways[i].winnerCount, 
        giveaways[i].requirements.messagesReq, 
        giveaways[i].requirements.invitesReq, 
        "Ended", 
        giveaways[i].hostedBy, 
        giveaways[i].prize
      );
      newObject.winners.push(winners);
      newObject.ended = true;
      
      const newData = giveaways.filter((giveaway) => giveaway.messageID != giveaways[i].messageID);
      
      newData.push(newObject);
      
      db.set(`giveaways_${guild.id}`, newData);
      
      let reqContent = "";
      let roleReq = db.fetch(`server_${guild.id}_roleReq`);
      if(giveaways[i].requirements.messagesReq > 0 || giveaways[i].requirements.invitesReq > 0 || roleReq != null) reqContent += `\n**${client.emojisConfig.tasks} Requirements**`;
      if(giveaways[i].requirements.messagesReq > 0) reqContent += `\n> **›** You need **${giveaways[i].requirements.messagesReq}** Message(s) to Enter Giveaway.`;
      if(giveaways[i].requirements.invitesReq > 0) reqContent += `\n> **›** You need **${giveaways[i].requirements.invitesReq}** Invite(s) to Enter Giveaway.`;
      if(roleReq) reqContent += `\n> **›** You need **<@&${roleReq}>** Role to Enter Giveaway.`;

      let editEmbed = new Discord.MessageEmbed()
        .setAuthor({ name: "Giveaway Ended", iconURL: client.user.displayAvatarURL() })
        .setDescription(`
**${client.emojisConfig.prize} About Giveaway**
> **${client.emojisConfig.reward} Reward:** ${giveaways[i].prize}
> **${client.emojisConfig.hoster} Hosted by:** <@${giveaways[i].hostedBy}>
> **${client.emojisConfig.timer} Time Remaining:** Ended
> **${client.emojisConfig.members} Number of Winners:** ${giveaways[i].winnerCount}
> **${client.emojisConfig.winners} Winner(s):** ${randomWinner ? winners : "No Winner(s)"}
${reqContent}

[Invite Me](${client.config.links.inviteURL}) | [Vote for me](${client.config.links.voteURL}) | [Website](${client.config.links.website}) | [Support Server](${client.config.links.supportServer})`)
        .setColor("RED")
        .setThumbnail(guild.iconURL())
        .setFooter({ text: "Ended", iconURL: client.user.displayAvatarURL() })
        .setTimestamp();
      
      msg.edit({ embeds: [editEmbed] });
      
      let hasWinners = `\`🎊\` Congratulations to ${giveaways[i].winnerCount > 1 ? "winners" : "winner"} ${winners} on winning this Giveaway!\nGood Luck to the others next time.`;
      let noWinners = `\`🎊\` Giveaway ended but there is no winner(s).`;
      
      db.delete(`server_${giveaways[i].guildID}_roleReq`);

      let endEmbed = new Discord.MessageEmbed()
        .setTitle("🎁・Giveaway")
        .setDescription(`${randomWinner ? hasWinners : noWinners}`)
        .setColor("YELLOW");
      
      channel.send({ embeds: [endEmbed] });

      let dmStatus = db.fetch(`server_${guild.id}_dmWinners`);
      const dmWin = new Discord.MessageEmbed()
        .setTitle("🎁・Giveaway")
        .setDescription(`\`👑\` Congratulations, you have Won Giveaway in **${guild.name}**!
  
 >>> **\`🎊\` Giveaway:** ${giveaways[i].prize}`)
        .setColor("YELLOW");
      if(randomWinner && dmStatus != null) winners.forEach((u) => u.send({ embeds: [dmWin] }));

    } else {
      let reqContent = "";
      let roleReq = db.fetch(`server_${guild.id}_roleReq`);
      if(giveaways[i].requirements.messagesReq > 0 || giveaways[i].requirements.invitesReq > 0 || roleReq != null) reqContent += `\n**${client.emojisConfig.tasks} Requirements**`;
      if(giveaways[i].requirements.messagesReq > 0) reqContent += `\n> **›** You need **${giveaways[i].requirements.messagesReq}** Message(s) to Enter Giveaway.`;
      if(giveaways[i].requirements.invitesReq > 0) reqContent += `\n> **›** You need **${giveaways[i].requirements.invitesReq}** Invite(s) to Enter Giveaway.`;
      if(roleReq) reqContent += `\n> **›** You need **<@&${roleReq}>** Role to Enter Giveaway.`;

      let embedChange = new Discord.MessageEmbed()
        .setAuthor({ name: "New Giveaway", iconURL: client.user.displayAvatarURL() })
        .setDescription(`
**${client.emojisConfig.prize} About Giveaway**
> **${client.emojisConfig.reward} Reward:** ${giveaways[i].prize}
> **${client.emojisConfig.hoster} Hosted by:** <@${giveaways[i].hostedBy}>
> **${client.emojisConfig.timer} Time Remaining:** ${client.utils.formatTime(giveaways[i].endsAt - Date.now())}
> **${client.emojisConfig.members} Number of Winners:** ${giveaways[i].winnerCount}
${reqContent}

[Invite Me](${client.config.links.inviteURL}) | [Vote for me](${client.config.links.voteURL}) | [Website](${client.config.links.website}) | [Support Server](${client.config.links.supportServer})`)
        .setColor("BLURPLE")
        .setThumbnail(guild.iconURL())
        .setFooter({ text: "Ends at", iconURL: client.user.displayAvatarURL() })
        .setTimestamp(giveaways[i].endsAt);

      msg.edit({ embeds: [embedChange] });
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
