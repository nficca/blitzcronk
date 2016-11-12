// COMMANDS
// -------
var general = require('./commands/general');

/**
 * Reads a command and determines which command function to run
 *
 * @param {Message} msg
 * @param {String}  command
 * @param {Array}   args
 */
module.exports = (msg, command, args) => {

  var execute_command = null;

  switch(command) {
    case 'choose':
      execute_command = general.choose;
      break;
    case 'echo':
      execute_command = general.echo;
      break;
    case 'ping':
      execute_command = general.ping;
      break;
    case 'users':
      execute_command = general.users;
      break;
  }

  if (execute_command) {
    execute_command(msg, args);
  } else {
    msg.channel.sendMessage("Sorry, `" + command + "` is not a command. Typo?");
  }
};
