const Discord = require("discord.js");
const db = require("quick.db");
const Event = require("../../structures/Events");

module.exports = class InteractionCreate extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(interaction) {
    if(this.client.disabledGuilds.includes(interaction.guild.id)) return;
    if (interaction.isCommand()) {
      await interaction.deferReply().catch(() => {});

      const cmd = this.client.slashCommands.get(interaction.commandName);
      if (!cmd) return interaction.followUp({ content: "> Error occured, please contact Bot Developer." });

      interaction.member = interaction.guild.members.cache.get(interaction.user.id);
      
      let userPerms = [];
      cmd.permissions.forEach((perm) => {
        if(!interaction.channel.permissionsFor(interaction.member).has(perm)) {
          userPerms.push(perm);
        }
      });
      if(userPerms.length > 0) return interaction.followUp({ embeds: [ this.client.embedBuilder(this.client, interaction.user, "Error", "You don't have permission to run this command.", "RED")] });

      const args = [];
      for (let option of interaction.options.data) {
        if (option.type === "SUB_COMMAND") {
          if (option.name) args.push(option.name);
          option.options?.forEach((x) => {
            if (x.value) args.push(x.value);
          });
        } else if (option.value) args.push(option.value);
      }

      cmd.slashRun(interaction, args);
    }
  }
};