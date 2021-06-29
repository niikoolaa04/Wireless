const Discord = require("discord.js");
const Event = require("../../structures/Events");
const moment = require("moment");

module.exports = class GuildDelete extends Event {
  constructor(...args) {
    super(...args);
  }

  async run(guild) {
    console.log(
      `[BOT] (${moment.utc(new Date()).tz('Europe/Belgrade').format('HH:mm:ss, DD/MM/YYYY.')}) I'm removed from the Guild ${guild.name} (${guild.id}) which had ${guild.memberCount} total members!`
    );
    db.delete(`giveaways_${guild.id}`);
  }
};