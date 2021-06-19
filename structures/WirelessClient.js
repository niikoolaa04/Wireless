const Discord = require("discord.js");

module.exports = class WirelessClient extends Discord.Client {
  constructor() {
    super({ disableMentions: "everyone", ws: { intents: Discord.Intents.ALL }, partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER']});
    
    // Files
    
    this.config = require("../configs/config.json");
    this.embedBuilder = require("../embeds/embedBuilder.js");
    this.utils = require("../utils/utils.js");
    this.emojisConfig = require("../configs/emojis.js");
    this.gw = require("../managers/giveawaysManager.js");
   
    // End Of Files
    // Other //
    
    this.db = require("quick.db");
    
    // Filip, Nikola Novi Acc, LA HAINE
    this.dev_ids = [
      "419609616943546378",
      "823228305167351808", 
      "186158262855401472"
    ];
    this.disabledGuilds = [
      "110373943822540800"
    ];
    this.invites = {};
    this.aliases = new Discord.Collection();
    this.commands = new Discord.Collection();
  }
  async login(token = this.token) {
    super.login(token);
  }
}