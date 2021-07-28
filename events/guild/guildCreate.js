const Discord = require("discord.js");
const Event = require("../../structures/Events");
const moment = require("moment");
const db = require("quick.db");

module.exports = class GuildCreate extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(guild) {
	  let userBL = db.fetch(`userBlacklist`) || [];
	  let guildBL = db.fetch(`guildBlacklist`) || [];
	  if(userBL.includes(guild.owner.user.id) || guildBL.includes(guild.id)) return guild.leave();
	  
    let ownerDM = new Discord.MessageEmbed()
      .setAuthor(guild.owner.user.username, this.client.user.displayAvatarURL())
      .setDescription(`Hey ${guild.owner.user}, thank you for adding me to **${guild.name}**.
To start with bot do \`${this.client.config.prefix}help\` to view all available commands.

**${this.client.emojisConfig.tasks} Starting Tips**
> Change Welcome/Leave Invites Messages \`(${this.client.config.prefix}welcomemessage, ${this.client.config.prefix}leavemessage)\`
> Checkout Variables for Welcome/Leave Messages \`(${this.client.config.prefix}variables)\`
> Setup Channel for Invites Messages \`(${this.client.config.prefix}inviteschannel)\`
> Change Prefix \`(${this.client.config.prefix}prefix)\`

\`If you encounter any issues please join our Support Server - ${this.client.config.links.supportServer}\``)
      .setColor("BLURPLE");
      
    let m = await guild.owner.send(ownerDM);
    await m.react("👋");
    
    console.log(
      `[BOT] (${moment.utc(new Date()).tz('Europe/Belgrade').format('HH:mm:ss, DD/MM/YYYY.')}) I'm added to the new Guild ${guild.name} (${guild.id}) which have ${guild.memberCount} total members!`
    );
	}
};