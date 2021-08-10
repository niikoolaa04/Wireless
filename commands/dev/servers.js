const Command = require("../../structures/Command");

module.exports = class Servers extends Command {
  constructor(client) {
    super(client, {
      name: "servers",
      description: "List of all servers bot is in",
      usage: "servers",
      permissions: [],
      aliases: ["serverlist", "serverslist"],
      category: "dev",
      listed: false,
    });
  } 
  
  async run(message, args) {
    var allowedToUse = false;
  
    this.client.dev_ids.forEach(id => {
      if (message.author.id == id) allowedToUse = true;
    });
  
    if (allowedToUse) {
  
      let guilds = this.client.guilds.cache.filter(g => g.memberCount > 2)
        .map(r => "> `" + r.name + "`" + " - **" + r.memberCount + "** members " + "[`" + r.id + "`]").join("\n");
      message.channel.send({ content: guilds});
    } else {
      message.channel.send({ content: "> Only Developer can use this Command!" });
    }
  }
};