const Discord = require('discord.js');
const ms = require('ms');

async function submitGiveaway(client, message, data) {
  let giveawayObject = client.utils.giveawayObject(
    message.guild.id, 
    0, 
    ms(data.duration), 
    data.channel.id, 
    parseInt(data.winners), 
    parseInt(data.messages), 
    parseInt(data.invites), 
    (Date.now() + ms(data.duration)), 
    message.author.id,
    data.prize,
  );
  client.gw.startGiveaway(client, message, giveawayObject);
  
  message.channel.send({ embeds: [ client.embedBuilder(client, message, "Giveaway", `Giveaway has started in ${channelArg}.`, "YELLOW")] });
}

async function prizeSetup(client, message, embed, filter, data) {
  embed.setDescription(`Enter Prize for this Giveaway.
Example: \`Nitro Classic\``);
  message.channel.send({ embeds: [embed] });

  let prizeCollector = message.channel.createMessageCollector({ filter, time: 60000, errors: ["time"] });

  prizeCollector.on("collect", async (msg) => {
    let cancelEmbed = new Discord.MessageEmbed()
      .setColor("BLURPLE")
      .setDescription('You have canceled Giveaway Creation')
      .setAuthor("Giveaway Setup", client.user.displayAvatarURL());
    if(msg.content.toLowerCase() == "cancel") {
      message.channel.send({ embeds: [cancelEmbed] });
      prizeCollector.stop()
      return;
    }

    let prizeArg = msg.content;

    if(!prizeArg || prizeArg.length < 3 || prizeArg.length > 256) return message.channel.send({ content: 'prize valid' })
    data.prize = msg.content;
    await submitGiveaway(client, message, data);
    prizeCollector.stop();
  });

  prizeCollector.on("end", collected => {
    message.channel.send({ content: 'collector end' })
  });
}

async function invitesSetup(client, message, embed, filter, data) {
  embed.setDescription(`Enter Number of Invites Required in order to Enter Giveaway - 0 for none.
Example: \`500\``);
  message.channel.send({ embeds: [embed] });

  let invCollector = message.channel.createMessageCollector({ filter, time: 60000, errors: ["time"] });

  invCollector.on("collect", async (msg) => {
    let cancelEmbed = new Discord.MessageEmbed()
      .setColor("BLURPLE")
      .setDescription('You have canceled Giveaway Creation')
      .setAuthor("Giveaway Setup", client.user.displayAvatarURL());
    if(msg.content.toLowerCase() == "cancel") {
      message.channel.send({ embeds: [cancelEmbed] });
      invCollector.stop()
      return;
    }

    if(isNaN(msg.content)) return message.channel.send({ content: 'inv num' })
    data.invites = msg.content;
    await prizeSetup(client, message, embed, filter, data);
    invCollector.stop();
  });

  invCollector.on("end", collected => {
    message.channel.send({ content: 'collector end' })
  });
}

async function messagesSetup(client, message, embed, filter, data) {
  embed.setDescription(`Enter Number of Messages Required in order to Enter Giveaway - 0 for none.
Example: \`500\``);
  message.channel.send({ embeds: [embed] });

  let msgCollector = message.channel.createMessageCollector({ filter, time: 60000, errors: ["time"] });

  msgCollector.on("collect", async (msg) => {
    let cancelEmbed = new Discord.MessageEmbed()
      .setColor("BLURPLE")
      .setDescription('You have canceled Giveaway Creation')
      .setAuthor("Giveaway Setup", client.user.displayAvatarURL());
    if(msg.content.toLowerCase() == "cancel") {
      message.channel.send({ embeds: [cancelEmbed] });
      msgCollector.stop()
      return;
    }

    if(isNaN(msg.content)) return message.channel.send({ content: 'msg num' })
    data.messages = msg.content;
    await invitesSetup(client, message, embed, filter, data);
    msgCollector.stop();
  });

  msgCollector.on("end", collected => {
    message.channel.send({ content: 'collector end' })
  });
}

async function winnersSetup(client, message, embed, filter, data) {
  embed.setDescription(`Enter Number of how much Winners you want.
Example: \`2\``);
  message.channel.send({ embeds: [embed] });

  let winnerCollector = message.channel.createMessageCollector({ filter, time: 60000, errors: ["time"] });

  winnerCollector.on("collect", async (msg) => {
    let cancelEmbed = new Discord.MessageEmbed()
      .setColor("BLURPLE")
      .setDescription('You have canceled Giveaway Creation')
      .setAuthor("Giveaway Setup", client.user.displayAvatarURL());
    if(msg.content.toLowerCase() == "cancel") {
      message.channel.send({ embeds: [cancelEmbed] });
      winnerCollector.stop()
      return;
    }

    if(isNaN(msg.content)) return message.channel.send({ content: 'winners num' })
    data.winners = msg.content;
    await messagesSetup(client, message, embed, filter, data);
    winnerCollector.stop();
  });

  winnerCollector.on("end", collected => {
    message.channel.send({ content: 'collector end' })
  });
}

async function channelSetup(client, message, embed, filter, data) {
  embed.setDescription(`Mention Channel in which to start Giveaway.
    Example: \`#general\``);
  message.channel.send({ embeds: [embed] });

  let channelCollector = message.channel.createMessageCollector({ filter, time: 60000, errors: ["time"] });

  channelCollector.on("collect", async (msg) => {
    let cancelEmbed = new Discord.MessageEmbed()
      .setColor("BLURPLE")
      .setDescription('You have canceled Giveaway Creation')
      .setAuthor("Giveaway Setup", client.user.displayAvatarURL());
    if(msg.content.toLowerCase() == "cancel") {
      message.channel.send({ embeds: [cancelEmbed] });
      channelCollector.stop()
      return;
    }

    if(!msg.mentions.channels.first()) return message.channel.send({ content: 'Mention Channel' })
    data.channel = msg.mentions.channels.first();
    await winnersSetup(client, message, embed, filter, data);
    channelCollector.stop();
  });

  channelCollector.on("end", collected => {
    message.channel.send({ content: 'collector end' })
  });
}

async function durationSetup(client, message, embed, filter) {
  let currentData = {
    duration: null,
    winners: 0,
    messages: 0,
    invites: 0,
    channel: null,
    prize: "N/A",
  };

  embed.setDescription(`Enter Duration for Giveaway.
    Example: \`2m\``)
  message.channel.send({ embeds: [embed] }); 

  let durationCollector = message.channel.createMessageCollector({ filter, time: 60000, errors: ["time"] });

  durationCollector.on("collect", async (msg) => {
    let cancelEmbed = new Discord.MessageEmbed()
      .setColor("BLURPLE")
      .setDescription('You have canceled Giveaway Creation')
      .setAuthor("Giveaway Setup", client.user.displayAvatarURL());
    if(msg.content.toLowerCase() == "cancel") {
      message.channel.send({ embeds: [cancelEmbed] });
      durationCollector.stop()
      return;
    }

    currentData.duration = msg.content;
    await channelSetup(client, message, embed, filter, currentData);
    durationCollector.stop();
  });

  durationCollector.on("end", collected => {
    message.channel.send('end collectyor')
  });
}

module.exports = {
  durationSetup,
}