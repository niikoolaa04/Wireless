const fs = require('fs');
const categories = fs.readdirSync('./commands/');

module.exports = client => {
  try {
    categories.forEach(async (category) => {
      fs.readdir(`./commands/${category}/`, (err) => {
        console.log(`[BOT] Učitavam Kategoriju - ${category}.`);
        if (err) return console.error(err);
        const init = async () => {
          const commands = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));
          for (const file of commands) {
            const f = require(`../commands/${category}/${file}`);
            const command = new f(client);
            client.commands.set(command.name.toLowerCase(), command);
            if(command.slash == true) {
              console.log("-----------------");
              console.log(command.name)
              if(command.options) console.log(command.options[0].name);
              client.slashCommands.set(command.name.toLowerCase(), command);
              client.slashArray.push(command);
            }
            //console.log("[BOT] Komanda " + file + " je uspešno učitana ✔");
            /*if (command.aliases && Array.isArray(command.aliases)) {
              for (let i = 0; i < command.aliases.length; i++) {
                client.aliases.set(command.aliases[i], command);
              }
            }*/
            if (command.aliases && Array.isArray(command.aliases)) command.aliases.forEach(alias => client.aliases.set(alias, command.name));
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