const Command = require("../../structures/Command");
const Discord = require("discord.js");
const db = require("quick.db");

module.exports = class GuildBlacklist extends Command {
  constructor(client) {
    super(client, {
      name: "guildbl",
      description: "Add/remove guild from blacklist",
      usage: "guildbl [add/remove/list] [Guild ID]",
      permissions: [],
      category: "dev",
      listed: false,
    });
  }

  async run(message, args) {
    var allowedToUse = false;
    this.client.dev_ids.forEach(id => {
      if (message.author.id == id) allowedToUse = true;
    });
    if (!allowedToUse) return;
    let type = args[0];
    let guild = args[1];
    if (!type) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", `You have entered invalid option \`(add, remove, list)\`.`, "RED")] });
    if (type.toLowerCase() == "add") {
      if (!guild || isNaN(guild)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", `You have entered invalid Server ID.`, "RED")] });
      let blArray = await Bot.find({ name: "wireless" }).guildBlacklist;
      if (blArray.includes(guild)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "That Server is already Blacklisted", "RED")] });

      await Bot.findOneAndUpdate({ name: "wireless" }, { $push: { guildBlacklist: guild } });
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Guild Blacklist", `Server with ID \`${guild}\` have been blacklisted.`, "YELLOW")] });
    } else if (type.toLowerCase() == "remove") {
      if (!guild || isNaN(guild)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", `You have entered invalid Guild ID.`, "RED")] });
      let blArray = await Bot.find({ name: "wireless" }).guildBlacklist;
      if (blArray.length == 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Guild Blacklist", `Blacklist is empty.`, "RED")] });
      await Bot.findOneAndUpdate({ name: "wireless" }, { $pull: { guildBlacklist: guild } });
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Guild Blacklist", `Server with ID \`(${guild})\` have been removed from blacklist.`, "YELLOW")] });
    } else if (type.toLowerCase() == "list") {
      let blArray = await Bot.find({ name: "wireless" }).guildBlacklist;
      if (blArray.length == 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Guild Blacklist", `Blacklist is empty.`, "RED")] });
      let content = "";
      for (let i = 0; i < blArray.length; i++) {
        content += `> \`#${i}\` ${blArray[i]}\n`;
      }
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Guild Blacklist", `Total Blacklisted Servers: \`${blArray.length}\`\n\n${content}`, "YELLOW")] });
    } else {
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", `You have entered invalid option \`(add, remove, list)\`.`, "RED")] });
    }
  }
};
