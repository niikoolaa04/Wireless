const Command = require("../../structures/Command");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const db = require("quick.db");

module.exports = class ActivateKey extends Command {
	constructor(client) {
		super(client, {
			name: "activatekey",
			description: "Activate Premium Key",
			usage: "activatekey",
			permissions: [],
			category: "member",
			listed: true,
      slash: true,
      options: [{
        name: "key",
        type: "STRING",
        description: "Premium Key",
        required: true,
      }]
		});
	}
  
  async run(message, args) {
    let sGuild = this.client.guilds.cache.get(this.client.config.developer.supportGuild);
    let member = sGuild.members.cache.get(message.author.id);
    if(!member.roles.cache.some(r => r == this.client.config.developer.patreon)) return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Error`, `You aren't our Patreon or have left Support Server.`, "RED")] });
    let key = args[0];
    let keyList = db.fetch(`premiumKeys`) || [];
    let invalidList = db.fetch(`invalidKeys`) || [];
    let premium = db.fetch(`server_${message.guild.id}_premium`);
    if(!key) 
      return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Error`, `You haven't entered Key.`, "RED")] });
    if(!keyList.includes(key) || invalidList.includes(key)) 
      return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Error`, `You have entered an Invalid/Already Used Key.`, "RED")] });
    if(premium == true) 
      return message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Error`, `This Server already have an Premium Subscription.`, "RED")] });

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("activate_key")
          .setLabel('Confirm')
          .setEmoji('✔')
          .setStyle('SUCCESS'),
      )
      .addComponents(
        new MessageButton()
          .setCustomId("cancel_key")
          .setLabel('Cancel')
          .setEmoji('❌')
          .setStyle('DANGER'),
      );

    let embed = new MessageEmbed()
      .setAuthor("Activate Server Key", this.client.user.displayAvatarURL())
      .setDescription(`>>> Are you sure you want to activate Premium Subscription for Guild **${message.guild.name}**?
Use Buttons to Confirm your decision, you have **1 minute**.
      
❗ **This Action cannot be undone.** ❗`)
      .setFooter(message.author.username, message.author.displayAvatarURL({ size: 1024, dynamic: true }))
      .setColor("YELLOW")
      .setTimestamp();

    let msg = await message.channel.send({ embeds: [embed], components: [row] });
    let collFilter = (i) => i.user.id == message.author.id;
    let collector = msg.createMessageComponentCollector({ collFilter, componentType: "BUTTON", time: 60000 });

    collector.on("collect", async(i) => {
      await i.deferUpdate();
      if(i.customId == "activate_key") {
        let usedFilter = keyList.filter((k) => k != key);
        db.set(`server_${message.guild.id}_premium`, true);
        db.set(`premiumKeys`, usedFilter);
        db.push(`userPremium_${message.guild.id}`, message.guild.id);
        db.push(`invalidKeys`, key);
    
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Premium Activation`, `Premium Subscription have been successfully activated for Guild **${message.guild.name}** using Premium Key \`${key}\`.`, "YELLOW")] });
        console.log(`[Premium Activated - ${key}] User ${message.author.username} (${message.author.id}) on ${message.guild.name} (${message.guild.id})`);
        collector.stop("collected");
      } else if(i.customId == "cancel_key") {
        message.channel.send({ embeds: [ this.client.embedBuilder(this.client, message.author, `Premium Activation`, `You have successfully canceled activation of Premium Subscription for **${message.guild.name}**.`, "RED")] });
        collector.stop("collected");
      }
    });
    collector.on("end", async (collected, reason) => {
      if(reason != "time") return;
      const disabledRow = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId("activate_key")
            .setLabel('Confirm')
            .setEmoji('✔')
            .setDisabled(true)
            .setStyle('SECONDARY'),
        )
        .addComponents(
          new MessageButton()
            .setCustomId("cancel_key")
            .setLabel('Cancel')
            .setEmoji('❌')
            .setDisabled(true)
            .setStyle('SECONDARY'),
        );
      await msg.edit({ embeds: [embed], components: [disabledRow] });
    })
  }
  async slashRun(interaction, args) {
    let sGuild = this.client.guilds.cache.get(this.client.config.developer.supportGuild);
    let member = sGuild.members.cache.get(interaction.user.id);
    if(!member.roles.cache.some(r => r == this.client.config.developer.patreon)) return interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, interaction.user, `Error`, `You aren't our Patreon or have left Support Server.`, "RED")] });
    let key = interaction.options.getString("key");
    let keyList = db.fetch(`premiumKeys`) || [];
    let invalidList = db.fetch(`invalidKeys`) || [];
    let premium = db.fetch(`server_${interaction.guild.id}_premium`);
    if(!keyList.includes(key) || invalidList.includes(key)) 
      return interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, interaction.user, `Error`, `You have entered an Invalid/Already Used Key.`, "RED")] });
    if(premium == true) 
      return interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, interaction.user, `Error`, `This Server already have an Premium Subscription.`, "RED")] });
  
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("activate_key")
          .setLabel('Confirm')
          .setEmoji('✔')
          .setStyle('SUCCESS'),
      )
      .addComponents(
        new MessageButton()
          .setCustomId("cancel_key")
          .setLabel('Cancel')
          .setEmoji('❌')
          .setStyle('DANGER'),
      );
  
    let embed = new MessageEmbed()
      .setAuthor("Activate Server Key", this.client.user.displayAvatarURL())
      .setDescription(`>>> Are you sure you want to activate Premium Subscription for Guild **${interaction.guild.name}**?
  Use Buttons to Confirm your decision, you have **1 minute**.
      
  ❗ **This Action cannot be undone.** ❗`)
      .setFooter(interaction.user.username, interaction.user.displayAvatarURL({ size: 1024, dynamic: true }))
      .setColor("YELLOW")
      .setTimestamp();
  
    let msg = await interaction.followUp({ embeds: [embed], components: [row] });
    let collFilter = (i) => i.user.id == interaction.user.id;
    let collector = msg.createMessageComponentCollector({ collFilter, componentType: "BUTTON", time: 60000 });
  
    collector.on("collect", async(i) => {
      await i.deferUpdate();
      if(i.customId == "activate_key") {
        let usedFilter = keyList.filter((k) => k != key);
        db.set(`server_${interaction.guild.id}_premium`, true);
        db.set(`premiumKeys`, usedFilter);
        db.push(`userPremium_${interaction.guild.id}`, interaction.guild.id);
        db.push(`invalidKeys`, key);
    
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, interaction.user, `Premium Activation`, `Premium Subscription have been successfully activated for Guild **${interaction.guild.name}** using Premium Key \`${key}\`.`, "YELLOW")] });
        console.log(`[Premium Activated - ${key}] User ${interaction.user.username} (${interaction.user.id}) on ${interaction.guild.name} (${interaction.guild.id})`);
        collector.stop("collected");
      } else if(i.customId == "cancel_key") {
        interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, interaction.user, `Premium Activation`, `You have successfully canceled activation of Premium Subscription for **${interaction.guild.name}**.`, "RED")] });
        collector.stop("collected");
      }
    });
    collector.on("end", async (collected, reason) => {
      if(reason != "time") return;
      const disabledRow = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId("activate_key")
            .setLabel('Confirm')
            .setEmoji('✔')
            .setDisabled(true)
            .setStyle('SECONDARY'),
        )
        .addComponents(
          new MessageButton()
            .setCustomId("cancel_key")
            .setLabel('Cancel')
            .setEmoji('❌')
            .setDisabled(true)
            .setStyle('SECONDARY'),
        );
      await msg.edit({ embeds: [embed], components: [disabledRow] });
    })
  }
};