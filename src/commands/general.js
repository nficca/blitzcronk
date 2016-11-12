var bot = require('../bot'),
    _ = require('lodash');

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
  },

  users: function(props) {
    let userList = _.map(bot.users, 'username');
    bot.sendMessage({
      to: props.channelId,
      message: userList.join(', ')
    });
  }
};
