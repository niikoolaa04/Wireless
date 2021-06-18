const Discord = require('discord.js');

module.exports = (client, message, title, description, color) => {
  let embed = new Discord.MessageEmbed().setFooter(message.author.username, message.author.displayAvatarURL({ size: 1024, dynamic: true })).setTimestamp();
  if (title.length > 0) {
    embed.setAuthor(title, client.user.displayAvatarURL())
    //embed.setTitle(title);
  }
  if (color.length > 0) {
    embed.setColor(color);
  }
  if (description.length > 0) {
    embed.setDescription(description);
  }
  return embed;
}