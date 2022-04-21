const Event = require("../../structures/Events");
const Discord = require("discord.js");
const Giveaway = require("../../models/Giveaway");
const moment = require("moment");

module.exports = class GuildDelete extends Event {
  constructor(...args) {
    super(...args);
  }

  async run(guild) {
    await Giveaway.deleteMany({ guildId: guild.id });

    let owner = guild.ownerId;
    let channel = this.client.channels.cache.get(this.client.config.logs);
    
    let embed = new Discord.MessageEmbed()
      .setTitle("Removed from Guild")
      .setDescription(`
**\`⭐\` Guild Name** - ${guild.name}
**\`#️⃣\` Guild ID** - ${guild.id}
**\`👑\` Guild Owner** - <@${owner}>
**\`👤\` Guild Member Count** - ${guild.memberCount}`)
      .setColor("RED");
    if(channel) channel.send({ embeds: [embed] })

    console.log(
      `[BOT] (${moment.utc(new Date()).tz('Europe/Belgrade').format('HH:mm:ss, DD/MM/YYYY.')}) I'm removed from the Guild ${guild.name} (${guild.id}) which had ${guild.memberCount} total members!`
    );
  }
};