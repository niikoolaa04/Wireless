const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class Poll extends Command {
  constructor(client) {
    super(client, {
      name: "poll",
      description: "Create a poll for users to react to",
      usage: "Poll [Message]",
      permissions: ["MANAGE_MESSAGES"],
      category: "utility",
      listed: true,
      slash: true,
      options: [{
        name: 'poll',
        type: 'STRING',
        description: "Poll Message",
        required: true,
      }]
    });
  }

  async run(message, args) {
    if(!args[0]) return message.channel.send(
      { embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You haven't entered what will poll be about.", "RED" ) ] }
    );
    let poll = args.join(" ");
    let embed = new Discord.MessageEmbed()
      .setTitle("📈・Poll")
      .setDescription(`>>> ${poll}`)
      .setColor("BLURPLE")
      .setTimestamp()
      .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }));

    message.channel.send({ embeds: [embed] }).then((msg) => {
      msg.react("1️⃣");
      msg.react("2️⃣");
    })
  }
  async slashRun(interaction, args) {
    let poll = interaction.options.getString("poll");
    let embed = new Discord.MessageEmbed()
      .setTitle("📈・Poll")
      .setDescription(`>>> ${poll}`)
      .setColor("BLURPLE")
      .setTimestamp()
      .setFooter(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true }));

    interaction.channel.send({ embeds: [embed] }).then((msg) => {
      msg.react("1️⃣");
      msg.react("2️⃣");
    });
  }
};