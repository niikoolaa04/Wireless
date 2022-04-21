const Event = require("../../structures/Events");
const Discord = require("discord.js");
const Guild = require("../../models/Guild.js");
const User = require("../../models/User.js");

module.exports = class MessageCreate extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(message) {
    if(this.client.disabledGuilds.includes(message.guild.id) && message.author.id != this.client.config.developer.id) return;
    if (message.channel.type === "DM") return;
    let guildData = await Guild.findOne({ id: message.guild.id }, "prefix -_id");
    
    if (message.author.bot) return;

    /* User.findOne({ id: message.author.id, guild: message.guild.id }, async(err, result) => {
      if(!result) {
        await User.create({
          id: message.author.id,
          guild: message.guild.id
        });
        console.log('created - messageCreate');
      }
    }); */

    
    await User.findOneAndUpdate({ id: message.author.id, guild: message.guild.id }, { $inc: { messages: 1 } }, { new: true, upsert: true });

    // <== Mention Bota ==> //
    const prefixMention = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
    if (message.content.match(prefixMention)) {
      let mentionEmbed = new Discord.MessageEmbed()
        .setDescription(`Hey ${message.author}, my current prefix for this Guild is \`${guildData.prefix}\`.
To view all commands do \`${guildData.prefix}help\`

[Invite Me](${this.client.config.links.inviteURL}) | [Website](${this.client.config.links.website}) | [Vote for me](${this.client.config.links.voteURL}) | [Support Server](${this.client.config.links.supportServer})`)
        .setColor("YELLOW")
        .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
      message.channel.send({ embeds: [mentionEmbed] });
    }

    // <== Commands ==> //
    if (message.content.indexOf(guildData.prefix) !== 0) return;
  
    const args = message.content
      .slice(guildData.prefix.length)
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
