const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const ms = require('ms');
const db = require("quick.db");

module.exports = class GiveawayEdit extends Command {
  constructor(client) {
    super(client, {
      name: "gedit",
      description: "Edit giveaway informations",
      usage: "gedit [Message ID]",
      permissions: ["ADMINISTRATOR"],
      aliases: ["gwedit"], 
      category: "giveaway",
      listed: true,
      slash: true,
      options: [{
        name: 'msgid',
        type: 'STRING',
        description: 'Message ID of Giveaway',
        required: true,
      }]
    });
  }

  async run(message, args) {
    let messageID = args[0];
    if (!messageID) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You haven't entered Message ID.", "RED")] });

    let giveaways = db.fetch(`giveaways_${message.guild.id}`);
    let gwData = giveaways.find(g => g.messageID == messageID && g.ended == false);
    
    if(!gwData) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, "Error", "You have entered invalid Message ID.", "RED")] });

    const editRow = new MessageActionRow()
	    .addComponents(
	      new MessageSelectMenu()
	        .setCustomId("edit_select")
	        .setPlaceholder("Select Option you want to Edit.")
	        .addOptions([{
              label: "Messages Requirement",
              value: "msg_req", 
              emoji: "💬"
            },{
              label: "Invites Requirement",
              value: "inv_req", 
              emoji: "🎫"
            },{
              label: "Number of Winners",
              value: "winners",
              emoji: "👑"
            },{
              label: "Extra Time",
              value: "extra_time",
              emoji: "⌚"
            },{
              label: "Prize",
              value: "prize",
              emoji: "🎁"
            }, {
              label: "Finish",
              value: "finish",
              emoji: "✔"
            }
          ]),
	    );

    let mainEmbed = new MessageEmbed()
      .setTitle("🎁・Giveaway")
      .setDescription(`Choose Option to edit from Select Menu.`)
      .setColor("BLURPLE");

    let msg = await message.channel.send({ embeds: [mainEmbed], components: [editRow] });

    let filter = (i) => i.customId == "edit_select" && i.user.id == message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, componentType: "SELECT_MENU", time: 180000 });

    collector.on("collect", async(i) => {
      if(i.values[0] == "msg_req") {
        await i.deferUpdate();
        mainEmbed.setDescription(`Enter Number of Messages Required in order to Enter Giveaway - 0 for none.
Example: \`500\``);
        await msg.edit({ embeds: [mainEmbed], components: [editRow] });
        let eFilter = m => m.author.id == message.author.id;
        message.channel.awaitMessages({ eFilter, max: 1, time: 30000, errors: ["time"]}).then(async (c) => {
          let m = c.first();
          m = m.content;
          if(isNaN(m)) return message.channel.send({ embeds: [ client.embedBuilder(client, message.author, "Error", `You have entered Invalid Number of Messages.`, "RED")] });
          this.client.gw.editGiveaway(this.client, message, messageID, message.guild, parseInt(m), 0, 0, 0, 0);
          i.followUp({ embeds: [ this.client.embedBuilder(this.client, message.author, "Giveaway", `Giveaway have been edited successfuly.`, "YELLOW")], ephemeral: true });
        });
      } else if(i.values[0] == "inv_req") {
        await i.deferUpdate();
        mainEmbed.setDescription(`Enter Number of Invites Required in order to Enter Giveaway - 0 for none.
Example: \`500\``);
        await msg.edit({ embeds: [mainEmbed], components: [editRow] });
        let eFilter = m => m.author.id == message.author.id;
        message.channel.awaitMessages({ eFilter, max: 1, time: 30000, errors: ["time"]}).then(async (c) => {
          let m = c.first();
          m = m.content;
          if(isNaN(m)) return message.channel.send({ embeds: [ client.embedBuilder(client, message.author, "Error", `You have entered Invalid Number of Invites.`, "RED")] });
          this.client.gw.editGiveaway(this.client, message, messageID, message.guild, 0, parseInt(m), 0, 0, 0);
          i.followUp({ embeds: [ this.client.embedBuilder(this.client, message.author, "Giveaway", `Giveaway have been edited successfuly.`, "YELLOW")], ephemeral: true });
        });
      } else if(i.values[0] == "winners") {
        await i.deferUpdate();
        mainEmbed.setDescription(`Enter Number of how much Winners you want.
Example: \`2\``);
        await msg.edit({ embeds: [mainEmbed], components: [editRow] });
        let eFilter = m => m.author.id == message.author.id;
        message.channel.awaitMessages({ eFilter, max: 1, time: 30000, errors: ["time"]}).then(async (c) => {
          let m = c.first();
          m = m.content;
          if(isNaN(m)) return message.channel.send({ embeds: [ client.embedBuilder(client, message.author, "Error", `You have entered Invalid Number of Winners.`, "RED")] });
          this.client.gw.editGiveaway(this.client, message, messageID, message.guild, 0, 0, parseInt(m), 0, 0);
          i.followUp({ embeds: [ this.client.embedBuilder(this.client, message.author, "Giveaway", `Giveaway have been edited successfuly.`, "YELLOW")], ephemeral: true });
        });
      } else if(i.values[0] == "extra_time") {
        await i.deferUpdate();
        mainEmbed.setDescription(`Enter Extra Time for Giveaway.
Example: \`2m\``);
        await msg.edit({ embeds: [mainEmbed], components: [editRow] });
        let eFilter = m => m.author.id == message.author.id;
        message.channel.awaitMessages({ eFilter, max: 1, time: 30000, errors: ["time"]}).then(async (c) => {
          let m = c.first();
          m = m.content;
          this.client.gw.editGiveaway(this.client, message, messageID, message.guild, 0, 0, 0, m, 0);
          i.followUp({ embeds: [ this.client.embedBuilder(this.client, message.author, "Giveaway", `Giveaway have been edited successfuly.`, "YELLOW")], ephemeral: true });
        });
      } else if(i.values[0] == "prize") {
        await i.deferUpdate();
        mainEmbed.setDescription(`Enter Prize for this Giveaway.
Example: \`Nitro Classic\``);
        await msg.edit({ embeds: [mainEmbed], components: [editRow] });
        let eFilter = m => m.author.id == message.author.id;
        message.channel.awaitMessages({ eFilter, max: 1, time: 30000, errors: ["time"]}).then(async (c) => {
          let m = c.first();
          m = m.content;
          if(m.length < 3 || m.length > 32) return message.channel.send({ embeds: [ client.embedBuilder(client, message.author, "Giveaway Setup", `You have entered Invalid Prize.`, "RED")] });
          this.client.gw.editGiveaway(this.client, message, messageID, message.guild, 0, 0, 0, 0, m);
          i.followUp({ embeds: [ this.client.embedBuilder(this.client, message.author, "Giveaway", `Giveaway have been edited successfuly.`, "YELLOW")], ephemeral: true });
        });
      } else if(i.values[0] == "finish") {
        i.followUp({ embeds: [ this.client.embedBuilder(this.client, message.author, "Giveaway", `You have successfully finished Editing of Giveaway.`, "YELLOW")], ephemeral: true });
        collector.stop("collected");
      }
    });

    collector.on("end", async (collected, reason) => {
      editRow.components[0].setDisabled(true);
      await msg.edit({ embeds: [mainEmbed], components: [disabledRow] });
    });
  }
  async slashRun(interaction, args) {
    let messageID = interaction.options.getString("msgid");
    messageID = parseInt(messageID);
  
    let giveaways = db.fetch(`giveaways_${interaction.guild.id}`);
    let gwData = giveaways.find(g => g.messageID == messageID && g.ended == false);
    
    if(!gwData) return interaction.reply({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Error", "You have entered invalid Message ID.", "RED")], ephemeral: true });
  
    const editRow = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId("edit_select")
          .setPlaceholder("Select Option you want to Edit.")
          .addOptions([{
              label: "Messages Requirement",
              value: "msg_req", 
              emoji: "💬"
            },{
              label: "Invites Requirement",
              value: "inv_req", 
              emoji: "🎫"
            },{
              label: "Number of Winners",
              value: "winners",
              emoji: "👑"
            },{
              label: "Extra Time",
              value: "extra_time",
              emoji: "⌚"
            },{
              label: "Prize",
              value: "prize",
              emoji: "🎁"
            },{
              label: "Finish",
              value: "finish",
              emoji: "✔"
            }
          ]),
      );
  
    let mainEmbed = new MessageEmbed()
      .setTitle("🎁・Giveaway")
      .setDescription(`Choose Option to edit from Select Menu.`)
      .setColor("BLURPLE");
  
    let msg = await interaction.reply({ embeds: [mainEmbed], components: [editRow] });
  
    let filter = (i) => i.customId == "edit_select" && i.user.id == interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: "SELECT_MENU", time: 180000 });
  
    collector.on("collect", async(i) => {
      await i.deferUpdate();
      if(i.values[0] == "msg_req") {
        await i.deferUpdate();
        mainEmbed.setDescription(`Enter Number of Messages Required in order to Enter Giveaway - 0 for none.
Example: \`500\``);
        await msg.editReply({ embeds: [mainEmbed], components: [editRow] });
        let eFilter = m => m.author.id == interaction.user.id;
        interaction.channel.awaitMessages({ eFilter, max: 1, time: 30000, errors: ["time"]}).then(async (c) => {
          let m = c.first();
          m = m.content;
          if(isNaN(m)) return interaction.followUp({ embeds: [ this.client.embedBuilder(client, interaction.user, "Error", `You have entered Invalid Number of Messages.`, "RED")] });
          this.client.gw.editGiveaway(this.client, interaction, messageID, interaction.guild, parseInt(m), 0, 0, 0, 0);
          interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Giveaway", `Giveaway have been edited successfuly.`, "YELLOW")], ephemeral: true });
        });
      } else if(i.values[0] == "inv_req") {
        await i.deferUpdate();
        mainEmbed.setDescription(`Enter Number of Invites Required in order to Enter Giveaway - 0 for none.
Example: \`500\``);
        await msg.editReply({ embeds: [mainEmbed], components: [editRow] });
        let eFilter = m => m.author.id == interaction.user.id;
        interaction.channel.awaitMessages({ eFilter, max: 1, time: 30000, errors: ["time"]}).then(async (c) => {
          let m = c.first();
          m = m.content;
          if(isNaN(m)) return interaction.followUp({ embeds: [ this.client.embedBuilder(client, interaction.user, "Error", `You have entered Invalid Number of Invites.`, "RED")] });
          this.client.gw.editGiveaway(this.client, interaction, messageID, interaction.guild, 0, parseInt(m), 0, 0, 0);
          interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Giveaway", `Giveaway have been edited successfuly.`, "YELLOW")], ephemeral: true });
        });
      } else if(i.values[0] == "winners") {
        await i.deferUpdate();
        mainEmbed.setDescription(`Enter Number of how much Winners you want.
Example: \`2\``);
        await msg.editReply({ embeds: [mainEmbed], components: [editRow] });
        let eFilter = m => m.author.id == interaction.user.id;
        interaction.channel.awaitMessages({ eFilter, max: 1, time: 30000, errors: ["time"]}).then(async (c) => {
          let m = c.first();
          m = m.content;
          if(isNaN(m)) return interaction.followUp({ embeds: [ this.client.embedBuilder(client, interaction.user, "Error", `You have entered Invalid Number of Winners.`, "RED")] });
          this.client.gw.editGiveaway(this.client, interaction, messageID, interaction.guild, 0, 0, parseInt(m), 0, 0);
          interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Giveaway", `Giveaway have been edited successfuly.`, "YELLOW")], ephemeral: true });
        });
      } else if(i.values[0] == "extra_time") {
        await i.deferUpdate();
        mainEmbed.setDescription(`Enter Extra Time for Giveaway.
Example: \`2m\``);
        await msg.editReply({ embeds: [mainEmbed], components: [editRow] });
        let eFilter = m => m.author.id == interaction.user.id;
        interaction.channel.awaitMessages({ eFilter, max: 1, time: 30000, errors: ["time"]}).then(async (c) => {
          let m = c.first();
          m = m.content;
          this.client.gw.editGiveaway(this.client, interaction, messageID, interaction.guild, 0, 0, 0, m, 0);
          interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Giveaway", `Giveaway have been edited successfuly.`, "YELLOW")], ephemeral: true });
        });
      } else if(i.values[0] == "prize") {
        await i.deferUpdate();
        mainEmbed.setDescription(`Enter Prize for Giveaway.
Example: \`Nitro Classic\``);
        await msg.editReply({ embeds: [mainEmbed], components: [editRow] });
        let eFilter = m => m.author.id == interaction.user.id;
        interaction.channel.awaitMessages({ eFilter, max: 1, time: 30000, errors: ["time"]}).then(async (c) => {
          let m = c.first();
          m = m.content;
          if(m.length < 3 || m.length > 32) return interaction.followUp({ embeds: [ this.client.embedBuilder(client, interaction.user, "Giveaway Setup", `You have entered Invalid Prize.`, "RED")] });
          this.client.gw.editGiveaway(this.client, interaction, messageID, interaction.guild, 0, 0, 0, 0, m);
          interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Giveaway", `Giveaway have been edited successfuly.`, "YELLOW")], ephemeral: true });
        });
      } else if(i.values[0] == "finish") {
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Giveaway", `You have successfully finished Editing of Giveaway.`, "YELLOW")], ephemeral: true });
        collector.stop("collected");
      }
    });
    collector.on("end", async (collected, reason) => {
      editRow.components[0].setDisabled(true);
      await msg.editReply({ embeds: [mainEmbed], components: [editRow] });
    });
  }
};
