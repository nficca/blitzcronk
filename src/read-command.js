var bot = require('./bot');

module.exports = function(command, args, user, userId, channelId, event) {
  switch(command) {
    case 'ping':
      bot.sendMessage({
        to: channelId,
        message: 'pong'
      });
      break;
    case 'echo':
      bot.sendMessage({
        to: channelId,
        message: args.join(' ')
      });
  }
}
