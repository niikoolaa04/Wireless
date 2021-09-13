const Command = require("../../structures/Command");
const Discord = require("discord.js");

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
    var allowedToUse = false;
    this.client.dev_ids.forEach(id => {
      if (message.author.id == id) allowedToUse = true;
    });
    if(!allowedToUse) return;
    let key = args[0];
    let keyList = db.fetch(`premiumKeys`);
    if(!key || !keyList.includes(key)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, 
        `Error`, "You have entered invalid Key.", "RED")] });
    
    let filter = keyList.filter(k => k != key);
    db.set(`premiumKeys`, filter);

    message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Key Removed`, `Premium Key \`${key}\` have been removed from database.`, "YELLOW")] });
  }
};