const db = require("quick.db");
const Discord = require("discord.js");

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
  let content = "";
  
  commands.forEach(
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

function configStrings() {
  const opcije = [
      "`1.` **-** Requirements Bypass Role",
      "`2.` **-** Giveaway Blacklist Role",
      "`3.` **-** Invites Messages Channel",
      "`4.` **-** Join Messages",
      "`5.` **-** Leave Messages",
      "`6.` **-** DM Winners"
    ];
  let text = "";
  for(const opcija of opcije) {
    text += `\n> ${opcija}`
  }
  return text;
}

const inviteToJson = (invite) => {
    return {
        code: invite.code,
        uses: invite.uses,
        maxUses: invite.maxUses,
        inviter: invite.inviter,
        channel: invite.channel,
        url: invite.url
    };
};


const generateInvitesCache = (invitesCache) => {
    const cacheCollection = new Discord.Collection();
    invitesCache.forEach((invite) => {
        cacheCollection.set(invite.code, inviteToJson(invite));
    });
    return cacheCollection;
};

const isEqual = (value, other) => {
    const type = Object.prototype.toString.call(value);
    if (type !== Object.prototype.toString.call(other)) return false;
    if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false;
    const valueLen = type === "[object Array]" ? value.length : Object.keys(value).length;
    const otherLen = type === "[object Array]" ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;
    const compare = (item1, item2) => {
        const itemType = Object.prototype.toString.call(item1);
        if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2)) return false;
        }
        else {
            if (itemType !== Object.prototype.toString.call(item2)) return false;
            if (itemType === "[object Function]") {
                if (item1.toString() !== item2.toString()) return false;
            } else {
                if (item1 !== item2) return false;
            }
        }
    };
    if (type === "[object Array]") {
        for (var i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) return false;
        }
    } else {
        for (var key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                if (compare(value[key], other[key]) === false) return false;
            }
        }
    }
    return true;
};

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
};

module.exports = {
  giveawayObject, 
  commandsList, 
  capitalizeFirstLetter, 
  formatVreme, 
  lbContent, 
  configStrings,
  isEqual, 
  generateInvitesCache, 
  inviteToJson, 
  asyncForEach, 
}