const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class Poll extends Command {
  constructor(client) {
    super(client, {
      name: "poll",
      description: "create a poll for users to react to",
      usage: "poll [Message]",
      permissions: ["MANAGE_MESSAGES"],
      category: "utility",
      listed: true,
    });
  }

  async run(message, args) {
    if(!arg[0]) return message.channel.send(
      { embeds: [ this.client.embedBuilder(this.client, message, "Error", "You haven't entered what will poll be about.", "RED" ) ] }
    );
    let poll = args.join(" ");
    let embed = new Discord.MessageEmbed()
      .setTitle("📈 • Poll")
      .setDescription(`>>> ${poll}`)
      .setTimestamp()
      .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }));

    message.channel.send({ embeds: [embed] }).then((msg) => {
      msg.react("1️⃣");
      msg.react("2️⃣");
    })
  }
};