const fs = require('fs');
const categories = fs.readdirSync('./slashCommands/');

module.exports = client => {
  try {
    categories.forEach(async (category) => {
      fs.readdir(`./slashCommands/${category}/`, (err) => {
        console.log(`[BOT] Učitavam Kategoriju - ${category} (slash cmd).`);
        if (err) return console.error(err);
        const init = async () => {
          const commands = fs.readdirSync(`./slashCommands/${category}`).filter(file => file.endsWith('.js'));
          for (const file of commands) {
            const f = require(`../slashCommands/${category}/${file}`);
            const command = new f(client);
            client.slashCommands.set(command.name.toLowerCase(), command);
            client.slashArray.push(command);
            //console.log("[BOT] Komanda " + file + " je uspešno učitana ✔");
            /*if (command.aliases && Array.isArray(command.aliases)) {
              for (let i = 0; i < command.aliases.length; i++) {
                client.aliases.set(command.aliases[i], command);
              }
            }*/
          }
        };
        init();
      });
    });
  }
  catch (error) {
    console.log(error);
  }
};