const Event = require("../../structures/Events");
const { generateInvitesCache } = require("../../utils/utils.js");


module.exports = class Ready extends Event {
	constructor(client) {
	  super(client, "ready");
		this.client = client;
	}

	async run() {
    console.log(`[BOT] I'm successfully started and I'm on ${this.client.guilds.cache.size} servers`);
    console.log(`[BOT] Total Member Count on all servers is ${this.client.users.cache.size}`);
  
    const activities_list = [
        `version v${this.client.config.version}`,
        `${this.client.users.cache.size} Members Across ${this.client.guilds.cache.size} Guilds`,
        `${this.client.slashArray.length} slash commands`,
        `${this.client.config.links.inviteSite.replace("https://", "")} Website`,
        `votes on ${this.client.config.links.voteURL.replace("https://", "")}`,
    ];
    const rand = Math.floor(Math.random() * (activities_list.length - 1) + 1);
      
    this.client.user.setActivity(activities_list[rand], { type: 'WATCHING' });
    
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
          this.client.user.setActivity(activities_list[index], { type: 'WATCHING' });
    }, 210000);

    let invites = {};
    
    await this.client.utils.asyncForEach([...this.client.guilds.cache.values()], async (guild) => {
      let fetchedInvites = null;
      await guild.invites.fetch().catch(() => {});
      fetchedInvites = generateInvitesCache(guild.invites.cache);
      invites[guild.id] = fetchedInvites;
    });
    this.client.invites = invites; 

    this.client.guilds.cache.forEach(g => {
      setInterval(() => {
        this.client.gw.checkGiveaway(this.client, g);
      }, 30000);
      if(!g.me.permissions.has("MANAGE_GUILD")) return;
    }); 
    
    setInterval(() => {
      this.client.guilds.cache.forEach(async (g) => {
        this.client.liveLb.updateLb(this.client, g)
      })
    }, 600000);

    // await this.client.guilds.cache.get("825090904359960586").commands.set(this.client.slashArray);
    await this.client.application.commands.set(this.client.slashArray);
	}
};
