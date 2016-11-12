var random = require('../helpers/random'),
    giphy = require('giphy-api')();

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
   * Searches giphy for a gif that matches the query
   *
   * @param {Message} msg
   * @param {Array}   args
   */
  gif: (msg, args) => {
    giphy.search(args.join(' '), (err, res) => {
      if (!err && res.data.length) {
        msg.channel.sendMessage(res.data[0].url);
      } else {
        msg.channel.sendMessage('Your search didn\'t yield any results! :sob:');
      }
    });
  },

  /**
   * Searches giphy for a random gif that matches the query
   *
   * @param {Message} msg
   * @param {Array}   args
   */
  gifr: (msg, args) => {
    giphy.search(args.join(' '), (err, res) => {
      if (!err && res.data.length) {
        msg.channel.sendMessage(random.element(res.data).url);
      } else {
        msg.channel.sendMessage('Your search didn\'t yield any results! :sob:');
      }
    });
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
   * Rolls a number between 1-100.
   * If arguments X, Y are given, rolls Y dXs.
   *
   * Ex: roll 2 6 = roll two d6 dice.
   *
   * Number of rolls must be between 1 and 100.
   * Number of sides on a die must be between 2 and 100.
   *
   * @param {Message} msg
   * @param {Array}   args
   */
  roll: (msg, args) => {
    let result = random.int(1, 100);

    // If rolling dice
    if (args.length >= 2) {
      let rolls = parseInt(args[0]);
      let die = parseInt(args[1]);
      if (rolls >= 1 && rolls <= 100 && die >= 2 && die <= 100) {
        result = 0;
        for (let i = 1; i <= rolls; ++i ) {
          result += random.int(1, die);
        }
      }
    }

    msg.channel.sendMessage(msg.author.toString() + ': ' + result);
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
