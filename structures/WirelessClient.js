const { Collection, Intents, Client} = require("discord.js");
const { AutoPoster } = require('topgg-autoposter')

module.exports = class WirelessClient extends Client {
  constructor() {

    const myIntents = new Intents();
    myIntents.add(
      Intents.FLAGS.GUILDS, 
      Intents.FLAGS.GUILD_BANS, 
      Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, 
      Intents.FLAGS.GUILD_INVITES, 
      Intents.FLAGS.GUILD_MEMBERS, 
      Intents.FLAGS.GUILD_MESSAGES, 
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_VOICE_STATES
    );

    super({ intents: myIntents, partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER']});
    
    const poster = AutoPoster(process.env.TOP_GG_TOKEN, this)

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
    this.aliases = new Collection();
    this.commands = new Collection();
  }
  async login(token = this.token) {
    super.login(token);
  }
}