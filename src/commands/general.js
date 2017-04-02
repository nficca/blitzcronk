const Random = require('../classes/Random'),
      giphy = require('giphy-api')(),
      _ = require('lodash'),
      docs = require('../../docs.json');

module.exports = {
  /**
   * /choose <choices...>
   * Chooses between given choices
   *
   * @param {Message} msg
   * @param {Array}   args
   */
  choose: (msg, args) => {
    msg.channel.sendMessage(Random.element(args));
  },

  /**
   * /echo <phrase>
   * Echoes the a text copy of phrase
   *
   * @param {Message} msg
   * @param {Array}   args
   */
  echo: (msg, args) => {
    msg.channel.sendMessage(args.join(' '));
  },

  /**
   * /gif <query>
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
   * /gifr <query>
   * Searches giphy for a random gif that matches the query
   *
   * @param {Message} msg
   * @param {Array}   args
   */
  gifr: (msg, args) => {
    giphy.search(args.join(' '), (err, res) => {
      if (!err && res.data.length) {
        msg.channel.sendMessage(Random.element(res.data).url);
      } else {
        msg.channel.sendMessage('Your search didn\'t yield any results! :sob:');
      }
    });
  },

  /**
   * /help <command>
   * Show help for specific command, or all commands if none given
   *
   * @param {Message} msg
   * @param {Array}   args
   */
  help: (msg, args) => {
    let info = null;

    if (args.length) {
      info = _.find(docs, {
        name: args[0],
        kind: 'function',
        memberof: 'module.exports'
      });
      if (info && /^[^(\[hide\])]/.test(info.description)) {
        msg.channel.sendMessage('```' + info.description + '```');
      } else {
        msg.channel.sendMessage('There is no `' + args[0] + '` command! :sob:');
      }
    } else {
      info = '';
      _.filter(docs, {
        kind: 'function',
        memberof: 'module.exports'
      }).forEach((doc) => {
        if (/^[^(\[hide\])]/.test(doc.description)) {
            info += doc.description + '\n\n';
        }
      });

      msg.channel.sendMessage('```Commands:\n\n' + info + '```');
    }
  },

  /**
   * /ping
   * Responds with 'pong!'
   *
   * @param {Message} msg
   * @param {Array}   args
   */
  ping: (msg, args) => {
    msg.channel.sendMessage('pong!');
  },

  /**
   * /roll <rolls>d<die>
   * Rolls a die with 'die' sides 'rolls' times, or picks a number between 1 and 100 if no arguments given
   *
   * @param {Message} msg
   * @param {Array}   args
   */
  roll: (msg, args) => {
    let result = Random.int(1, 100);

    // If rolling dice
    if (args.length === 1) {
      let inputs = args[0].split('d');
      if (inputs.length === 2 && parseInt(inputs[0]) && parseInt([1])) {
          let rolls = parseInt(inputs[0]);
          let die = parseInt(inputs[1]);
          if (rolls >= 1 && rolls <= 100 && die >= 2 && die <= 100) {
              result = 0;
              for (let i = 1; i <= rolls; ++i) {
                  result += Random.int(1, die);
              }
          }
      }
    }

    msg.channel.sendMessage(msg.author.toString() + ': ' + result);
  },

  /**
   * /users
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
