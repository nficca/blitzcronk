import * as general from './commands/general';
import * as stats from './commands/stats';

/**
 * Reads a command and determines which command function to run
 *
 * @param {Message} msg
 * @param {String}  command
 * @param {Array}   args
 */
export default (msg, command, args) => {

  let execute_command = null;

  // create lists of all commands
  const general_commands    = ['choose', 'echo', 'gif', 'gifr', 'help', 'ping', 'roll', 'users'];
  const data_commands       = ['chatters', 'stats', 'swearjar'];

  // check to see if it's a general command
  if (general_commands.indexOf(command) > -1) {
      execute_command = general[command];
  }

  // check to see if it's a data command
  else if (data_commands.indexOf(command) > -1) {
      execute_command = stats[command];
  }

  // looked through all commands and found no results
  else {
      msg.channel.sendMessage("Sorry, `" + command + "` is not a command. Typo?");
      return;
  }

  // execute the desired command
  try {
      execute_command(msg, args);
  } catch (e) {
      console.error('Failed to execute command');
      console.error(e);
  }
};
