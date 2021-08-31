const Discord = require("discord.js");
const db = require("quick.db"); 
const delay = require("delay");
const Event = require("../../structures/Events");

module.exports = class MessageCreate extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(message) {
    if(this.client.disabledGuilds.includes(message.guild.id) && message.author.id != this.client.config.developer.id) return;
    if (message.channel.type === "DM") return;
    let prefix = await db.fetch(`settings_${message.guild.id}_prefix`);
    if (prefix == null) prefix = this.client.config.prefix;

    if (message.author.bot) return;
  
    db.add(`messages_${message.guild.id}_${message.author.id}`, 1);

    // <== Mention Bota ==> //
    const prefixMention = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
    if (message.content.match(prefixMention)) {
      let mPrefix = db.fetch(`settings_${message.guild.id}_prefix`);
      if(mPrefix === null) mPrefix = "+";
      let mentionEmbed = new Discord.MessageEmbed()
        .setDescription(`Hey ${message.author}, my current prefix for this Guild is \`${mPrefix}\`.
To view all commands do \`${mPrefix}help\`

[Invite Me](${this.client.config.links.inviteURL}) | [Vote for me](${this.client.config.links.voteURL}) | [Website](${this.client.config.links.website}) | [Support Server](${this.client.config.links.supportServer})`)
        .setColor("YELLOW")
        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
      message.channel.send({ embeds: [mentionEmbed] });
    }

    // <== Commands ==> //
    if (message.content.indexOf(prefix) !== 0) return;
  
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
        if(userPerms.length > 0) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You don't have permission to run this command.", "RED")] });
      }
    }
    if(cmd) cmd.run(message, args);
	}
};