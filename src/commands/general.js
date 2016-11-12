var random = require('../helpers/random');

/**
 * General commands
 */
module.exports = {
  /**
   * Chooses the winning argument
   *
   * @param {Message} msg
   * @param {Array}   args
   */
  choose: (msg, args) => {
    msg.channel.sendMessage(random.element(args));
  },

  /**
   * Echoes the a text copy of the arguments
   *
   * @param {Message} msg
   * @param {Array}   args
   */
  echo: (msg, args) => {
    msg.channel.sendMessage(args.join(' '));
  },

  /**
   * Responds with 'pong!'
   *
   * @param {Message} msg
   * @param {Array}   args
   */
  ping: (msg, args) => {
    msg.channel.sendMessage('pong!');
  },

  /**
   * Responds with a list of the users in the current channel
   *
   * @param {Message} msg
   * @param {Array}   args
   */
  users: (msg, args) => {
    let user_list = msg.channel.members.map(member => {
      return member.user.username;
    });
    msg.channel.sendMessage(user_list.join(', '));
  }
};
