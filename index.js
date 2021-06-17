const fs = require("fs");
const BoltClient = require("./structures/BoltClient");
const dotenv = require("dotenv").config();

const client = new BoltClient(process.env.BOT_TOKEN)
client.login(process.env.BOT_TOKEN);

["commands", "events"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});