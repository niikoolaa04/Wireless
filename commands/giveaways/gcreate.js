const Command = require("../../structures/Command");
const Discord = require('discord.js');
const ms = require('ms');
const db = require("quick.db");

module.exports = class GiveawayCreate extends Command {
	constructor(client) {
		super(client, {
			name: "gcreate",
			description: "start new giveaway using interactive menu",
			usage: "gcreate",
			permissions: ["ADMINISTRATOR"],
			aliases: ["gwcreate", "gwsetup", "gsetup"],
			category: "giveaway",
			listed: true,
		});
	}
    
  async run(message, args) {
    if(message.author.id != "823228305167351808") return message.reply({ content: 'Command temporary disabled, please use +gstart' });
    let embed = new Discord.MessageEmbed()
      .setColor("BLURPLE")
      .setAuthor("Giveaway Setup", this.client.user.displayAvatarURL());
    
    let durationArg;
    let channelArg;
    let winnersArg;
    let messagesArg
    let invitesArg;
    let prizeArg;
    let channelCollector;
    let msgCollector;
    let invCollector;
    let prizeCollector;
    
    embed.setDescription(`Enter Duration for Giveaway.
Example: \`2m\``)

    let filter = m => m.author.id === message.author.id;

    message.channel.send({ embeds: [embed] }); 
    let durationCollector = message.channel.createMessageCollector({ filter, time: 60000 });

    durationCollector.on("collect", msg => {
      if(msg.content.toLowerCase() == "cancel") {
        msg.stop();
      }

      durationArg = msg.content;

      embed.setDescription(`Mention Channel in which to start Giveaway.
      Example: \`#general\``);
      message.channel.send({ embeds: [embed] });
      channelCollector = message.channel.createMessageCollector({ filter, time: 60000 });

      durationCollector.stop();
    });

    await channelCollector.on("collect", msg => {
      if(msg.content.toLowerCase() == "cancel") {
        msg.stop();
      }

      let channel = msg.mentions.channels.first();
      if(!channel) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You haven't mentioned Channel.", "RED")] });
      channelArg = channel;

      embed.setDescription(`Enter Number of Winners you want.
      Example: \`2\``);
      message.channel.send({ embeds: [embed] });
          
      winnersCollector = message.channel.createMessageCollector({ filter, time: 60000 });

      channelCollector.stop();
    });

    winnersCollector.on("collect", msg => {
      if(msg.content.toLowerCase() == "cancel") {
        msg.stop();
      }

      winnersArg = msg.content;
      if(isNaN(winnersArg)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Number of Winners.", "RED")] });

      embed.setDescription(`Enter Number of Messages Required in order to Enter Giveaway - 0 for none.
      Example: \`500\``);
      message.channel.send({ embeds: [embed] });
      
      msgCollector = message.channel.createMessageCollector({ filter, time: 60000 });

      winnersCollector.stop();
    });

    msgCollector.on("collect", msg => {
      if(msg.content.toLowerCase() == "cancel") {
        msg.stop();
      }

      messagesArg = msg.content;
      if(isNaN(messagesArg)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Number of Messages Required for Entering Giveaway.", "RED")] });

      embed.setDescription(`Enter Number of Invites Required in order to Enter Giveaway - 0 for none.
      Example: \`10\``);
      message.channel.send({ embeds: [embed] });
          
      invCollector = message.channel.createMessageCollector({ filter, time: 60000 });

      msgCollector.stop();
    });

    invCollector.on("collect", msg => {
      if(msg.content.toLowerCase() == "cancel") {
        msg.stop();
      }

      invitesArg = msg.content;
      if(isNaN(invitesArg)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Number of Invites Required for Entering Giveaway.", "RED")] });

      embed.setDescription(`Enter Prize for this Giveaway.
      Example: \`Nitro Classic\``);
      message.channel.send({ embeds: [embed] });
      
      prizeCollector = message.channel.createMessageCollector({ filter, time: 60000 });

      invCollector.stop();
    });

    prizeCollector.on("collect", msg => {
      if(msg.content.toLowerCase() == "cancel") {
        msg.stop();
      }

      prizeArg = msg.content;
      if(!prizeArg || prizeArg.length < 3 || prizeArg.length > 256) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Error", "You have entered invalid Prize.", "RED")] })

      let giveawayObject = this.client.utils.giveawayObject(
        message.guild.id, 
        0, 
        ms(durationArg), 
        channelArg.id, 
        parseInt(winnersArg), 
        parseInt(messagesArg), 
        parseInt(invitesArg), 
        (Date.now() + ms(durationArg)), 
        message.author.id,
        prizeArg,
      );
      this.client.gw.startGiveaway(this.client, message, giveawayObject);
      
      message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message, "Giveaway", `Giveaway has started in ${channelArg}.`, "YELLOW")] });

      prizeCollector.stop();
    });

    durationCollector.on("end", collected => {
      if(durationArg) return;
      console.log('duration end');
    })
    channelCollector.on("end", collected => {
      if(channelArg) return;
      console.log('channel end');
    })
    winnersCollector.on("end", collected => {
      if(winnersArg) return;
      console.log('winners end');
    })
    msgCollector.on("end", collected => {
      if(messagesArg) return;
      console.log('msg end');
    })
    invCollector.on("end", collected => {
      if(invitesArg) return;
      console.log('inv end');
    })
    prizeCollector.on("end", collected => {
      if(prizeArg) return;
      console.log('prize end');
    })
  }
};