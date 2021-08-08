const SlashCommands = require("../../structures/SlashCommands");

module.exports = class Test extends SlashCommands {
  constructor(client) {
    super(client, {
      name: "test",
      description: "test",
      usage: "test",
      permissions: [],
    });
  }

  async run(interaction, args) {
    interaction.followUp({ content: `${this.client.ws.ping}ms!` });
  }
};