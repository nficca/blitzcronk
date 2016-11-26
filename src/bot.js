const read_command = require('./read-command'),
      discord = require('discord.js');

const bot = new discord.Client();

bot.login("MjQ2ODI3NjcxNzM5MzAxODg4.CwgTyg.vd_Vxg5d4oVNTjsxgh4xp7chFr0"); // test-bot

// TODO: Retrieve this from some customizable external source, i.e. ini file
const command_prefix = '/';

/**
 * Sanity Log message on login
 */
bot.on('ready', () => {
  console.log('Logged in as %s - %s\n', bot.user.username, bot.user.id);
});

/**
 * Handles all incoming messages and parses them for a command
 */
bot.on('message', (message) => {

  let prefix_regex      = new RegExp('^' + command_prefix + '[a-zA-Z0-9_]+');
  let components_regex  = new RegExp('[^ ]+|"(?:\\\\"|[^"])+"', 'g');

  // check if the message starts with the command prefix
  if (prefix_regex.test(message.content)) {

    // split the message into components
    let message_components = message.content.substring(1).match(components_regex);

    // remove double-quotes from args
    for (let i = 0; i < message_components.length; ++i) {
      message_components[i] = message_components[i].replace(/"/g, '');
    }

    // get the command string and arguments array
    let command = message_components[0];
    let args = message_components.splice(1);

    // process the command
    read_command(message, command, args);
  }

});
