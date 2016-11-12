// COMMANDS
// -------
var general = require('./commands/general');

var bot = require('./bot');

module.exports = function(command, args, user, userId, channelId, event) {
  var props = {
    args: args,
    user: user,
    userId: userId,
    channelId: channelId,
    event: event
  };

  var execute_command = null;

  switch(command) {
    case 'ping':
      execute_command = general.ping;
      break;
    case 'echo':
      execute_command = general.echo;
      break;
    case 'users':
      execute_command = general.users;
      break;
  }

  if (execute_command) execute_command(props);
};
