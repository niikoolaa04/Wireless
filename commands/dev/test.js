const Command = require("../../structures/Command");
const Discord = require('discord.js');
const db = require("quick.db");

module.exports = class Test extends Command {
  constructor(client) {
    super(client, {
      name: "test",
      description: "Command for Testing",
      usage: "test",
      permissions: [],
      category: "dev",
      listed: false,
      slash: true, 
      options: [{
        name: 'osmak',
        type: 'SUB_COMMAND',
        description: "Test 1 ",
        required: false,
      },{
        name: 'devetak',
        type: 'SUB_COMMAND',
        description: "Test 2",
        required: false,
      },{
        name: 'desetak',
        type: 'SUB_COMMAND',
        description: "Test 3",
        required: false,
        options: [{
          name: 'subdesetak', 
          type: 'STRING', 
          required: false
        }]
      }]
    });
  }

  async run(message, args) {
    var allowedToUse = false;
    this.client.dev_ids.forEach(id => {
      if (message.author.id == id) allowedToUse = true;
    });
    if (!allowedToUse) return;
  }
  async slashRun(interaction, args) {
    var allowedToUse = false;
    this.client.dev_ids.forEach(id => {
      if (interaction.user.id == id) allowedToUse = true;
    });
    if (!allowedToUse) return;
    const [devetak, subdesetak] = args;
    console.log("-----------")
    console.log(subdesetak)
    console.log(devetak);
    console.log("-----------")
  }
};