const Discord = require("discord.js");
const Event = require("../../structures/Events");
const Guild = require("../../models/Guild.js");
const Bot = require("../../models/Bot.js");
const moment = require("moment");

module.exports = class GuildCreate extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(guild) {
    let owner = await guild.fetchOwner();
	  let userBL = await Bot.findOne({ name: "wireless" }).userBlacklist;
	  let guildBL = await Bot.findOne({ name: "wireless" }).guildBlacklist;
	  if(userBL?.includes(owner.user.id) || guildBL?.includes(guild.id)) return guild.leave();
	  
    let channel = this.client.channels.cache.get(this.client.config.logs);
    let embed = new Discord.MessageEmbed()
      .setTitle("Added to Guild")
      .setDescription(`
**\`⭐\` Guild Name** - ${guild.name}
**\`#️⃣\` Guild ID** - ${guild.id}
**\`👑\` Guild Owner** - ${owner.user.username}
**\`👤\` Guild Member Count** - ${guild.memberCount}`)
      .setColor("YELLOW");
    if(channel) channel.send({ embeds: [embed] })

    Guild.findOne({ id: guild.id }, async(err, result) => {
      if(!result) {
        await Guild.create({
          id: guild.id
        });
      }
    });

    console.log(
      `[BOT] (${moment.utc(new Date()).tz('Europe/Belgrade').format('HH:mm:ss, DD/MM/YYYY.')}) I'm added to the new Guild ${guild.name} (${guild.id}) which have ${guild.memberCount} total members!`
    );

    let ownerDM = new Discord.MessageEmbed()
      .setAuthor({ text: owner.user.username, iconURL: this.client.user.displayAvatarURL() })
      .setDescription(`Hey ${owner.user}, thank you for adding me to **${guild.name}**.
To start with bot do \`${this.client.config.prefix}help\` to view all available commands.

**${this.client.emojisConfig.tasks} Starting Tips**
> Change Welcome/Leave Invites Messages \`(${this.client.config.prefix}welcomemessage, ${this.client.config.prefix}leavemessage)\`
> Checkout Variables for Welcome/Leave Messages \`(${this.client.config.prefix}variables)\`
> Setup Channel for Invites Messages \`(${this.client.config.prefix}inviteschannel)\`
> Change Prefix \`(${this.client.config.prefix}prefix)\`

\`If you encounter any issues please join our Support Server - ${this.client.config.links.supportServer}\``)
      .setColor("BLURPLE");
      
    let m = await owner.send({ embeds: [ownerDM] });
    await m.react("👋");
	}
};
