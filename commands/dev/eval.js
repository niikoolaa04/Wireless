const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class Eval extends Command {
	constructor(client) {
		super(client, {
			name: "eval",
			description: "Evaluate js code",
			usage: "eval [js kod]",
			permissions: [],
			category: "dev",
			listed: false,
		});
	}
  
  async run(message, args) {
    var allowedToUse = false;
  
    this.client.dev_ids.forEach(id => {
      if (message.author.id == id) allowedToUse = true;
    });
  
    if (allowedToUse == false) return;
    const hastebin = require('hastebin-gen');
    const embed = new Discord.MessageEmbed()
      .setAuthor("Eval", this.client.user.displayAvatarURL())
      .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp();
    const code = args.join(' ');

    String.prototype.replaceAll = function (search, replacement) {
      return this.replace(RegExp(search, 'gi'), replacement);
    };
    this.client.clean = text => {
      if (typeof text !== 'string') {
          text = require('util')
              .inspect(text, { depth: 0 });
      }
      text = text
          .replace(/`/g, '`' + String.fromCharCode(8203))
          .replace(/@/g, '@' + String.fromCharCode(8203))
          .replaceAll(this.client.token, 'N/A')
      return text;
  };
    try {
      if(!args[0]) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, 
      `Error`, "You haven't entered Code to run.", "RED")] });
      const evaled = this.client.clean(eval(code));
      embed.addField('📥・Input', `\`\`\`xl\n${code}\n\`\`\``);
      embed.setColor('YELLOW');
      if (evaled.length < 800) {
        embed.addField('📤・Output', `\`\`\`xl\n${evaled}\n\`\`\``);
      } else {
        await hastebin(evaled, { extension: "js", url: "https://paste.nikolaa.me"}).then(r => {
            embed.addField('📤・Output', `\`\`\`xl\n${r}\n\`\`\``)
          });
        }
      message.channel.send({ embeds: [embed] });
    } catch (err) {
        embed.addField('📥・Input', `\`\`\`\n${code}\n\`\`\``);
        embed.setColor('RED');
        embed.addField('📤・Error', `\`\`\`xl\n${err}\n\`\`\``);
        message.channel.send({ embeds: [embed] });
    }
  }
}
function clean(text) {
  return text
    .replace(/`/g, "`" + String.fromCharCode(8203))
    .replace(/@/g, "@" + String.fromCharCode(8203));
};