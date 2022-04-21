const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class RemovePremium extends Command {
	constructor(client) {
		super(client, {
			name: "removepremium",
			description: "Remove Premium from Guild",
			usage: "removepremium [Guild ID]",
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
    let guild = args[0];
    if(!guild || !this.client.guilds.cache.get(guild)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, 
        `Error`, "You have entered invalid Guild ID.", "RED")] });
    
    let premium = await Guild.findOne({ id: message.guild.id }).premium;
    if(premium != true) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, 
      `Error`, "That Guild don't have Premium Subscription.", "RED")] });

    await Guild.findOneAndUpdate({ id: guild }, { premium: false });
    guild = this.client.guilds.cache.get(guild);

    message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Premium Removed`, `Premium Subscription have been removed from Guild **${guild.name}**.`, "YELLOW")] });
  }
};
