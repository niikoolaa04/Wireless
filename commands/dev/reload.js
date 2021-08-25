const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class Reload extends Command {
	constructor(client) {
		super(client, {
			name: "reload",
			description: "Reload Command",
			usage: "reload [Category] [Command]",
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
    let category = args[0];
    let cmd = args[1]
    if(!category || !cmd || !this.client.commands.has(cmd)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, 
        `Error`, "You haven't entered Category/Command.", "RED")] });
        
    delete require.cache[require.resolve(`../${category}/${cmd}.js`)];
    this.client.commands.delete(cmd);
    const props = require(`../${category}/${cmd}.js`);
    const command = new props(this.client);
    
    this.client.commands.set(command.name.toLowerCase(), command);

    message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, `Reload`, "Command have been reloaded successfully.", "YELLOW")] });
  }
};