/**
 * General commands
 */
module.exports = {
  /**
   * Responds with 'pong!'
   *
   * @param {Message} msg
   * @param {Array}   args
   */
  ping: function(msg, args) {
    msg.channel.sendMessage('pong!');
  },

  /**
   * Echoes the a text copy of the arguments
   *
   * @param {Message} msg
   * @param {Array}   args
   */
  echo: function(msg, args) {
    msg.channel.sendMessage(args.join(' '));
  },

  /**
   * Responds with a list of the users in the current channel
   *
   * @param {Message} msg
   * @param {Array}   args
   */
  users: function(msg, args) {
    let user_list = msg.channel.members.map(function(member) {
      return member.user.username;
    });
    msg.channel.sendMessage(user_list.join(', '));
  }
};
