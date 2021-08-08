const fs = require("fs");
const WirelessClient = require("./structures/WirelessClient");
const dotenv = require("dotenv").config();

const client = new WirelessClient(process.env.BOT_TOKEN)
client.login(process.env.BOT_TOKEN);

["commands", "events"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});