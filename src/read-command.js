// COMMANDS
// -------
const general = require('./commands/general');
const stats   = require('./commands/stats');

/**
 * Reads a command and determines which command function to run
 *
 * @param {Message} msg
 * @param {String}  command
 * @param {Array}   args
 */
module.exports = (msg, command, args) => {

  let execute_command = null;

  switch(command) {
    // General Commands
    case 'choose':
      execute_command = general.choose;
      break;
    case 'echo':
      execute_command = general.echo;
      break;
    case 'gif':
      execute_command = general.gif;
      break;
    case 'gifr':
      execute_command = general.gifr;
      break;
    case 'help':
      execute_command = general.help;
      break;
    case 'ping':
      execute_command = general.ping;
      break;
    case 'roll':
      execute_command = general.roll;
      break;
    case 'users':
      execute_command = general.users;
      break;

    // Stats Commands
    case 'chatters':
      execute_command = stats.chatters;
      break;
    case 'stats':
      execute_command = stats.stats;
      break;
    case 'swearjar':
      execute_command = stats.swearjar;
      break;
  }

  if (execute_command) {
    execute_command(msg, args);
  } else {
    msg.channel.sendMessage("Sorry, `" + command + "` is not a command. Typo?");
  }
};
