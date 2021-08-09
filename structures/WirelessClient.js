const { MessageEmbed, Collection, Intents, Client } = require("discord.js");
const { AutoPoster } = require('topgg-autoposter');
const express = require('express');
const Topgg = require('@top-gg/sdk');

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
    
    const app = express();
    const webhook = new Topgg.Webhook('wireless_wh11551');
    
    app.post('/dblwebhook', webhook.listener(vote => {
      let channel = this.channels.cache.get(this.config.logs);
      let embed = new MessageEmbed()
        .setTitle("Top.gg Vote")
        .setDescription(`<@${vote.user}> just voted for bot on top.gg`)
        .setColor("YELLOW");
      channel.send({ embeds: [embed] })
    }));
    
    app.listen(7542);

    // Files
    
    this.config = require("../configs/config.json");
    this.embedBuilder = require("../embeds/embedBuilder.js");
    this.embedInteraction = require("../embeds/embedInteraction");
    this.utils = require("../utils/utils.js");
    this.setupUtils = require("../utils/setupUtils");
    this.emojisConfig = require("../configs/emojis.js");
    this.gw = require("../managers/giveawaysManager.js");
   
    // End Of Files
    // Other //
    
    this.db = require("quick.db");
    
    // Filip, Nikola Novi Acc, LA HAINE
    this.dev_ids = [
      "823228305167351808", 
    ];
    this.disabledGuilds = [
      "110373943822540800",
      "361577445704466432",
    ];
    this.invites = {};
    this.aliases = new Collection();
    this.commands = new Collection();
    this.slashCommands = new Collection();
    this.slashArray = [];
  }
  async login(token = this.token) {
    super.login(token);
  }
}