const Command = require("../../structures/Command");
const Discord = require("discord.js");
const db = require("quick.db");

module.exports = class PremiumKey extends Command {
	constructor(client) {
		super(client, {
			name: "premiumkey",
			description: "Generate Premium Key",
			usage: "premiumkey",
			permissions: [],
			category: "member",
			listed: true,
      slash: true,
		});
	}
  
  async run(message, args) {
    let sGuild = this.client.guilds.cache.get(this.client.config.developer.supportGuild);
    let member = sGuild.members.cache.get(message.author.id);
    let generated = await User.findOne({ id: message.author.id }).generateCount;
    let limit = await User.findOne({ id: message.author.id }).generateLimit;
    
    if(!member.roles.cache.some(r => r == this.client.config.developer.patreon)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Error`, `You aren't our Patreon or have left Support Server.`, "RED")] });
    if(generated == limit) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Error`, `You have already generated maximum number of keys.`, "RED")] });
    
    let keyList = await Key.find({ used: false });
    let usedKeys = await Key.find({ used: true });
    
    let key = this.client.utils.premiumKey();
    if(keyList.some((x) => x.toLowerCase() == key.toLowerCase()) || usedList.some((x) => x.toLowerCase() == key.toLowerCase())) 
      return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Error`, "Generated Key Already exist in Database, please run command again.", "RED")] });

    await Key.create({
      data: key,
      guild: null,
      used: false,
      user: message.author.id
    })

    let closed = false;
    message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Premium Key`, `Premium Key have been sent to your DM.`, "YELLOW")] });
    message.author.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Premium Key`, `Premium Key \`${key}\` have been generated successfully. To redeem it use \`activatekey\` command on Server you want to Upgrade.`, "YELLOW")] }).catch((err) => {
      closed = true;
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Error`, `Your DM is closed, please open it.`, "RED")] });
    });
    if(closed == true) return;
    await User.findOneAndUpdate({ id: message.author.id }, { $inc: { generateCount: 1 }});
  }
  async slashRun(interaction, args) {
    let sGuild = this.client.guilds.cache.get(this.client.config.developer.supportGuild);
    let member = sGuild.members.cache.get(interaction.user.id);
    let generated = db.fetch(`generated_${interaction.user.id}`);
    if(!member.roles.cache.some(r => r == this.client.config.developer.patreon)) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, `Error`, `You aren't our Patreon or have left Support Server.`, "RED")], ephemeral: true });
    if(generated == true) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, `Error`, `You have already generated key.`, "RED")], ephemeral: true });
    let keyList = db.fetch(`premiumKeys`) || [];
    let usedList = db.fetch(`invalidKeys`) || [];
    let key = this.client.utils.premiumKey();
    if(keyList.includes(key) || usedList.includes(key)) 
      return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, `Error`, "Generated Key Already exist in Database, please run command again.", "RED")], ephemeral: true });
  
    db.push(`premiumKeys`, key);
    let closed = false;
    interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, `Premium Key`, `Premium Key have been sent to your DM.`, "YELLOW")], ephemeral: true });
    interaction.user.send({ embeds: [ this.client.embedBuilder(this.client, interaction.user, `Premium Key`, `Premium Key \`${key}\` have been generated successfully. To redeem it use \`activatekey\` command on Server you want to Upgrade.`, "YELLOW")] }).catch((err) => {
      closed = true;
      interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, interaction.user, `Error`, `Your DM is closed, please open it.`, "RED")] });
    });
    if(closed == true) return;
    db.set(`generated_${interaction.user.id}`, true);
  }
};
