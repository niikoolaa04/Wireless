const Command = require("../../structures/Command");
const Discord = require("discord.js");
const db = require("quick.db");

module.exports = class UserBlacklist extends Command {
  constructor(client) {
    super(client, {
      name: "userbl",
      description: "Add/remove user from blacklist",
      usage: "userbl [add/remove/list] [User ID]",
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
    let user = args[1];
    if (!type) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", `You have entered invalid option \`(add, remove, list)\`.`, "RED")] });
    if (type.toLowerCase() == "add") {
      if (!user || isNaN(user)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", `You have entered invalid User ID.`, "RED")] });
      let blArray = db.fetch(`userBlacklist`) || [];
      if (blArray.includes(user)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "That User is already blacklisted.", "RED")] });
      blArray.unshift(user);
      db.set(`userBlacklist`, blArray);
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "User Blacklist", `User <@${user}> \`(${user})\` have been blacklisted.`, "YELLOW")] });
    } else if (type.toLowerCase() == "remove") {
      if (!user || isNaN(user)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", `You have entered invalid User ID.`, "RED")] });
      let blArray = db.fetch(`userBlacklist`) || [];
      if (blArray.length == 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "User Blacklist", `Blacklist is empty.`, "RED")] });
      let newData = blArray.filter(id => id != user);
      db.set(`userBlacklist`, newData);
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "User Blacklist", `User <@${user}> \`(${user})\` have been removed from blacklist.`, "YELLOW")] });
    } else if (type.toLowerCase() == "list") {
      let blArray = db.fetch(`userBlacklist`) || [];
      if (blArray.length == 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "User Blacklist", `Blacklist is empty.`, "RED")] });
      let content = "";
      for (let i = 0; i < blArray.length; i++) {
        content += `> \`#${i}\` <@${blArray[i]}> \`(${blArray[i]})\`\n`;
      }
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "User Blacklist", `Total Blacklisted Users: \`${blArray.length}\`\n\n${content}`, "YELLOW")] });
    } else {
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", `You have entered invalid option \`(add, remove, list)\`.`, "RED")] });
    }
  }
};