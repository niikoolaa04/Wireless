const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require("quick.db");
const ms = require('ms');

async function submitGiveaway(client, message, data) {
  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('createGw')
        .setEmoji("🎉")
        .setLabel("Yes, Start Giveaway")
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId('cancelGw')
        .setEmoji("❌")
        .setLabel("No, don't Start Giveaway")
        .setStyle('DANGER'));

  let gwConfirm = new MessageEmbed()
    .setTitle(`🎁・Giveaway Setup`)
    .setDescription(`Are this Giveaway Details Good? Confirm by clicking Button.

**\`⏰\` Giveaway Duration:** ${client.utils.formatTime(ms(data.duration))}
**\`#️⃣\` Channel to Start in:** ${data.channel}
**\`👑\` Number of Winners:** ${data.winners}
**\`💬\` Messages Required:** ${data.messages}
**\`🎫\` Invites Required:** ${data.invites}
**\`🎁\` Prize:** ${data.invites}`)
    .setColor("BLURPLE")

  messageReply(message, gwConfirm, row);
  // message.channel.send({ embeds: [gwConfirm], components: [row] });

  let filter = m => m.user.id === message.member.id;
  const collector = message.channel.createMessageComponentCollector({ filter, time: 30000, errors: ["time"] });

  collector.on("collect", async i => {
    if(i.customId == "createGw") {
      await i.deferUpdate();
      let giveawayObject = client.utils.giveawayObject(
        message.guild.id, 
        0, 
        ms(data.duration), 
        data.channel.id, 
        parseInt(data.winners), 
        parseInt(data.messages), 
        parseInt(data.invites), 
        (Date.now() + ms(data.duration)), 
        message.member.id,
        data.prize,
      );
      client.gw.startGiveaway(client, message, giveawayObject);

      messageReply(message, client.embedBuilder(client, message.member.user, "Giveaway", `Giveaway has started in ${data.channel}.`, "YELLOW"));
      collector.stop();
    } else if(i.customId == "cancelGw") {
      await i.deferUpdate();
      client.gwCreation.set(message.member.id, false);
      messageReply(message, client.embedBuilder(client, message.member.user, "Giveaway Setup", `Giveaway creation have been stopped.`, "RED"));
      collector.stop();
    }
  });

  collector.on("end", (collected, reason) => {
    if(reason != "time") return;
    client.gwCreation.set(message.member.id, false);
    let endEmbed = new MessageEmbed()
      .setColor("RED")
      .setDescription('Time has passed without response, giveaway creation stopped')
      .setAuthor({ name: "Giveaway Setup", iconURL: client.user.displayAvatarURL() });
    messageReply(message, endEmbed);
    // message.channel.send({ embeds: [endEmbed] });
  })
}

async function prizeSetup(client, message, embed, filter, data) {
  embed.setDescription(`Enter Prize for this Giveaway.
Example: \`Nitro Classic\``);
  messageReply(message, embed);
  // message.channel.send({ embeds: [embed] });

  let prizeCollector = message.channel.createMessageCollector({ filter, time: 60000, errors: ["time"] });

  prizeCollector.on("collect", async (msg) => {
    let cancelEmbed = new MessageEmbed()
      .setColor("BLURPLE")
      .setDescription('You have canceled Giveaway Creation')
      .setAuthor({ name: "Giveaway Setup", iconURL: client.user.displayAvatarURL() });
    if(msg.content.toLowerCase() == "cancel") {
      client.gwCreation.set(message.member.id, false);
      messageReply(message, cancelEmbed);
      // message.channel.send({ embeds: [cancelEmbed] });
      prizeCollector.stop()
      return;
    }

    let prizeArg = msg.content;

    if(!prizeArg || prizeArg.length < 3 || prizeArg.length > 32) return messageReply(message, client.embedBuilder(client, message.member.user, "Giveaway Setup", `You have entered Invalid Prize.`, "RED"));
    data.prize = msg.content;
    await submitGiveaway(client, message, data);
    prizeCollector.stop();
  });

  prizeCollector.on("end", (collected, reason) => {
    if(reason != "time") return;
    client.gwCreation.set(message.member.id, false);
    let endEmbed = new MessageEmbed()
      .setColor("RED")
      .setDescription('Time has passed without response, giveaway creation stopped')
      .setAuthor({ name: "Giveaway Setup", iconURL: client.user.displayAvatarURL() });
    messageReply(message, endEmbed);
    // message.channel.send({ embeds: [endEmbed] });
  });
}

async function invitesSetup(client, message, embed, filter, data) {
  embed.setDescription(`Enter Number of Invites Required in order to Enter Giveaway - 0 for none.
Example: \`500\``);
  messageReply(message, embed);
  // message.channel.send({ embeds: [embed] });

  let invCollector = message.channel.createMessageCollector({ filter, time: 60000, errors: ["time"] });

  invCollector.on("collect", async (msg) => {
    let cancelEmbed = new MessageEmbed()
      .setColor("BLURPLE")
      .setDescription('You have canceled Giveaway Creation')
      .setAuthor({ name: "Giveaway Setup", iconURL: client.user.displayAvatarURL() });
    if(msg.content.toLowerCase() == "cancel") {
      client.gwCreation.set(message.member.id, false);
      messageReply(message, cancelEmbed);
      // message.channel.send({ embeds: [cancelEmbed] });
      invCollector.stop()
      return;
    }

    if(isNaN(msg.content)) return messageReply(message, client.embedBuilder(client, message.member.user, "Giveaway Setup", `You have entered Invalid Number of Invites.`, "RED"));
    data.invites = msg.content;
    await prizeSetup(client, message, embed, filter, data);
    invCollector.stop();
  });

  invCollector.on("end", (collected, reason) => {
    if(reason != "time") return;
    client.gwCreation.set(message.member.id, false);
    let endEmbed = new MessageEmbed()
      .setColor("RED")
      .setDescription('Time has passed without response, giveaway creation stopped')
      .setAuthor({ name: "Giveaway Setup", iconURL: client.user.displayAvatarURL() });
    messageReply(message, endEmbed);
    // message.channel.send({ embeds: [endEmbed] });
  });
}

async function messagesSetup(client, message, embed, filter, data) {
  embed.setDescription(`Enter Number of Messages Required in order to Enter Giveaway - 0 for none.
Example: \`500\``);
  messageReply(message, embed);
  // message.channel.send({ embeds: [embed] });

  let msgCollector = message.channel.createMessageCollector({ filter, time: 60000, errors: ["time"] });

  msgCollector.on("collect", async (msg) => {
    let cancelEmbed = new MessageEmbed()
      .setColor("BLURPLE")
      .setDescription('You have canceled Giveaway Creation')
      .setAuthor({ name: "Giveaway Setup", iconURL: client.user.displayAvatarURL() });
    if(msg.content.toLowerCase() == "cancel") {
      client.gwCreation.set(message.member.id, false);
      messageReply(message, cancelEmbed);
      // message.channel.send({ embeds: [cancelEmbed] });
      msgCollector.stop()
      return;
    }

    if(isNaN(msg.content)) return messageReply(message, client.embedBuilder(client, message.member.user, "Giveaway Setup", `You have entered Invalid Number of Messages.`, "RED"));
    data.messages = msg.content;
    await invitesSetup(client, message, embed, filter, data);
    msgCollector.stop();
  });

  msgCollector.on("end", (collected, reason) => {
    if(reason != "time") return;
    client.gwCreation.set(message.member.id, false);
    let endEmbed = new MessageEmbed()
      .setColor("RED")
      .setDescription('Time has passed without response, giveaway creation stopped')
      .setAuthor({ name: "Giveaway Setup", iconURL: client.user.displayAvatarURL() });
    messageReply(message, endEmbed);
    // message.channel.send({ embeds: [endEmbed] });
  });
}

async function winnersSetup(client, message, embed, filter, data) {
  let premiumGuild = db.fetch(`server_${message.guild.id}_premium`);
  embed.setDescription(`Enter Number of how much Winners you want.
Example: \`2\``);
  messageReply(message, embed);
  // message.channel.send({ embeds: [embed] });

  let winnerCollector = message.channel.createMessageCollector({ filter, time: 60000, errors: ["time"] });

  winnerCollector.on("collect", async (msg) => {
    let cancelEmbed = new MessageEmbed()
      .setColor("BLURPLE")
      .setDescription('You have canceled Giveaway Creation')
      .setAuthor({ name: "Giveaway Setup", iconURL: client.user.displayAvatarURL() });
    if(msg.content.toLowerCase() == "cancel") {
      client.gwCreation.set(message.member.id, false);
      messageReply(message, cancelEmbed);
      // message.channel.send({ embeds: [cancelEmbed] });
      winnerCollector.stop()
      return;
    }
    
    if(isNaN(msg.content)) return messageReply(message, client.embedBuilder(client, message.member.user, "Giveaway Setup", `You have entered Invalid Number of Winners.`, "RED"));
    if(msg.content > 20 && premiumGuild != true) return messageReply(message, client.embedBuilder(client, message.member, "Error", "To Create Giveaway with 20+ Winners you need Premium, get more informations using command `premium`.", "RED"));
    data.winners = msg.content;
    await messagesSetup(client, message, embed, filter, data);
    winnerCollector.stop();
  });

  winnerCollector.on("end", (collected, reason) => {
    if(reason != "time") return;
    client.gwCreation.set(message.member.id, false);
    let endEmbed = new MessageEmbed()
      .setColor("RED")
      .setDescription('Time has passed without response, giveaway creation stopped')
      .setAuthor({ name: "Giveaway Setup", iconURL: client.user.displayAvatarURL() });
    messageReply(message, endEmbed);
    // message.channel.send({ embeds: [endEmbed] });
  });
}

async function channelSetup(client, message, embed, filter, data) {
  embed.setDescription(`Mention Channel in which to start Giveaway.
    Example: \`#general\``);
  messageReply(message, embed);
  // message.channel.send({ embeds: [embed] });

  let channelCollector = message.channel.createMessageCollector({ filter, time: 60000, errors: ["time"] });

  channelCollector.on("collect", async (msg) => {
    let cancelEmbed = new MessageEmbed()
      .setColor("BLURPLE")
      .setDescription('You have canceled Giveaway Creation')
      .setAuthor({ name: "Giveaway Setup", iconURL: client.user.displayAvatarURL() });
    if(msg.content.toLowerCase() == "cancel") {
      client.gwCreation.set(message.member.id, false);
      messageReply(message, cancelEmbed);
      // message.channel.send({ embeds: [cancelEmbed] });
      channelCollector.stop()
      return;
    }

    if(!msg.mentions.channels.first()) return messageReply(message, client.embedBuilder(client, message.member.user, "Giveaway Setup", `You have entered Invalid Channel.`, "RED"));
    data.channel = msg.mentions.channels.first();
    await winnersSetup(client, message, embed, filter, data);
    channelCollector.stop();
  });

  channelCollector.on("end", (collected, reason) => {
    if(reason != "time") return;
    client.gwCreation.set(message.member.id, false);
    let endEmbed = new MessageEmbed()
      .setColor("RED")
      .setDescription('Time has passed without response, giveaway creation stopped')
      .setAuthor({ name: "Giveaway Setup", iconURL: client.user.displayAvatarURL() });
    messageReply(message, endEmbed);
    // message.channel.send({ embeds: [endEmbed] });
  });
}

async function durationSetup(client, message, embed, filter, inter) {
  let currentData = {
    duration: null,
    winners: 0,
    messages: 0,
    invites: 0,
    channel: null,
    prize: "N/A",
    interaction: inter
  };

  embed.setDescription(`Enter Duration for Giveaway.
Example: \`2m\``);
  messageReply(message, embed);
  // message.channel.send({ embeds: [embed] });

  let durationCollector = message.channel.createMessageCollector({ filter, time: 60000, errors: ["time"] });

  durationCollector.on("collect", async (msg) => {
    let cancelEmbed = new MessageEmbed()
      .setColor("BLURPLE")
      .setDescription('You have canceled Giveaway Creation')
      .setAuthor({ name: "Giveaway Setup", iconURL: client.user.displayAvatarURL() });
    if(msg.content.toLowerCase() == "cancel") {
      client.gwCreation.set(message.member.id, false);
      messageReply(message, cancelEmbed);
      // message.channel.send({ embeds: [cancelEmbed] });
      durationCollector.stop()
      return;
    }

    currentData.duration = msg.content;
    await channelSetup(client, message, embed, filter, currentData);
    durationCollector.stop();
  });

  durationCollector.on("end", (collected, reason) => {
    if(reason != "time") return;
    client.gwCreation.set(message.member.id, false);
    let endEmbed = new MessageEmbed()
      .setColor("RED")
      .setDescription('Time has passed without response, giveaway creation stopped')
      .setAuthor({ name: "Giveaway Setup", iconURL: client.user.displayAvatarURL() });
    messageReply(message, endEmbed);
    //message.channel.send({ embeds: [endEmbed] });
  });
}

const messageReply = (message, content, comp = null) => {
  if(message.type == "APPLICATION_COMMAND") {
    message.followUp({ embeds: [content], components: [comp], ephemeral: true });
  } else {
    message.channel.send({ embeds: [content] });
  }
}

module.exports = {
  durationSetup,
}
