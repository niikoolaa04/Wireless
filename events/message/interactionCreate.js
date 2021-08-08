const Discord = require("discord.js");
const db = require("quick.db");
const Event = require("../../structures/Events");

module.exports = class InteractionCreate extends Event {
	constructor(...args) {
		super(...args);
	}

	async run(interaction) {
    if (interaction.isCommand()) {
      await interaction.deferReply({ ephemeral: false }).catch(() => {});

      const cmd = this.client.slashCommands.get(interaction.commandName);
      if (!cmd) return interaction.followUp({ content: "An error has occured " });

      const args = [];

      // for (let option of interaction.options.data) {
      //     if (option.type === "SUB_COMMAND") {
      //         if (option.name) args.push(option.name);
      //         option.options?.forEach((x) => {
      //             if (x.value) args.push(x.value);
      //         });
      //     } else if (option.value) args.push(option.value);
      // }
      interaction.member = interaction.guild.members.cache.get(interaction.user.id);

      cmd.run(interaction, args);
  }
  }
};