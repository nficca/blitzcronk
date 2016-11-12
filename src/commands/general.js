var bot = require('../bot');

module.exports = {
  ping: function(props) {
    bot.sendMessage({
      to: props.channelId,
      message: 'pong!'
    });
  },

  echo: function(props) {
    bot.sendMessage({
      to: props.channelId,
      message: props.args.join(' ')
    });
  }
};
