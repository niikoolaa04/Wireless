const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Key = require("../../models/Key.js");

module.exports = class RemoveKey extends Command {
	constructor(client) {
		super(client, {
			name: "removekey",
			description: "Remove Premium Key from Database",
			usage: "removekey [Key]",
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
    let key = args[0];
    let keyList = await Bot.find({ used: false });
    if(!key || !keyList.some((x) => x.toLowerCase() == key.toLowerCase())) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, 
        `Error`, "You have entered invalid Key.", "RED")] });
    
    await Key.findOneAndUpdate({ data: key, used: false }, { used: true }, { new: true, upsert: true });

    message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Key Removed`, `Premium Key \`${key}\` have been removed from database.`, "YELLOW")] });
  }
};
