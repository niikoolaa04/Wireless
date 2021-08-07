const Discord = require("discord.js");
const db = require("quick.db");
const Event = require("../../structures/Events");
const moment = require("moment");

module.exports = class GuildDelete extends Event {
  constructor(...args) {
    super(...args);
  }

  async run(guild) {
    let owner = await guild.fetchOwner();
    let channel = this.client.channels.cache.get(this.client.config.logs);
    let embed = new MessageEmbed()
      .setTitle("Removed from Guild")
      .setDescription(`
**\`⭐\` Guild Name** - ${guild.name}
**\`#️⃣\` Guild ID** - ${guild.id}
**\`👑\` Guild Owner** - ${owner.user.username}
**\`👤\` Guild Member Count** - ${guild.memberCount}`)
      .setColor("RED");
    channel.send({ embeds: [embed] })

    console.log(
      `[BOT] (${moment.utc(new Date()).tz('Europe/Belgrade').format('HH:mm:ss, DD/MM/YYYY.')}) I'm removed from the Guild ${guild.name} (${guild.id}) which had ${guild.memberCount} total members!`
    );
    db.delete(`giveaways_${guild.id}`);
  }
};