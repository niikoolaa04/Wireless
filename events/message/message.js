const Discord = require("discord.js");
const db = require("quick.db"); 
const delay = require("delay");
const Event = require("../../structures/Events");

module.exports = class Message extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(message) {
    if (message.channel.type === "dm") return;
    let prefix = await db.fetch(`settings_${message.guild.id}_prefix`);
    if (prefix === null) prefix = this.client.config.prefix;

    if (message.author.bot) return;
  
    db.add(`messages_${message.guild.id}_${message.author.id}`, 1);
    

    // <== Mention Bota ==> //
    const prefixMention = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
    if (message.content.match(prefixMention)) {
      let mPrefix = db.fetch(`settings_${message.guild.id}_prefix`);
      if(mPrefix === null) mPrefix = "+";
      let mentionEmbed = new Discord.MessageEmbed()
        .setDescription(`Hey ${message.author}, my current prefix is \`${mPrefix}\`.
To view all commands do \`${mPrefix}help\``)
        .setColor("YELLOW")
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
      message.channel.send(mentionEmbed);
    }

    // <== Commands ==> //
  
    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();
    
    let cmd = this.client.commands.get(command);
    if (!cmd) cmd = this.client.commands.get(this.client.aliases.get(command));

    let guild = message.guild.id;
    if (message.guild.id === guild) {
      if(cmd !== undefined) {
        let userPerms = [];
        cmd.permissions.forEach((perm) => {
          if(!message.channel.permissionsFor(message.member).has(perm)) {
              userPerms.push(perm);
          }
        });
        if(userPerms.length > 0) return message.channel.send(this.client.embedManager.noPerm(this.client, message));
      }
    }
    if(cmd) cmd.run(message, args);
	}
};