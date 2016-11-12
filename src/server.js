var read_command = require('./read-command'),
    bot = require('./bot');

// TODO: Retrieve this from some customizable external source, i.e. ini file
var command_prefix = '/';

// Sanity message
bot.on('ready', function(event) {
  console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

// Handle incoming message
bot.on('message', function(user, userId, channelId, message, event) {

  var prefix_regex = new RegExp('^' + command_prefix + '[a-zA-Z0-9_]+');
  var components_regex = new RegExp('\\w+|"(?:\\\\"|[^"])+"', 'g');

  // check if the message starts with the command prefix
  if (prefix_regex.test(message)) {

    // split the message into components
    var message_components = message.match(components_regex);

    // remove double-quotes from args
    for (let i = 0; i < message_components.length; ++i) {
      message_components[i] = message_components[i].replace(/"/g, '');
    }

    // get the command string and arguments array
    var command = message_components[0];
    var args = message_components.splice(1);

    // process the command
    read_command(command, args, user, userId, channelId, event);
  }

});
