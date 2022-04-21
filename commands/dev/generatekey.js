const Command = require("../../structures/Command");
const Discord = require("discord.js");
const db = require("quick.db");

module.exports = class GenerateKey extends Command {
	constructor(client) {
		super(client, {
			name: "generatekey",
			description: "Generate Premium Key",
			usage: "generatekey",
			permissions: [],
			category: "dev",
			listed: false,
		});
	}
  
  async run(message, args) {
    let allowedToUse = false;
    this.client.dev_ids.forEach(id => {
      if (message.author.id == id) allowedToUse = true;
    });
    if(!allowedToUse) return;
    let keyList = await Key.find({ used: false });
    let usedList = await Key.find({ used: true });

    let key = this.client.utils.premiumKey();
    if(keyList.some((x) => x.data.toLowerCase() == key.toLowerCase()) || usedList.some((x) => x.data.toLowerCase() == key.toLowerCase())) 
      return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Error`, "Generated Key Already exist in Database, please run command again.", "RED")] });
  
    Key.create({
      data: key,
      guild: null,
      used: false,
      user: null
    });
    message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Premium Key`, `Premium Key \`${key}\` have been generated successfully.`, "YELLOW")] });
  }
};
