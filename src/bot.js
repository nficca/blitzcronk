import Stats from './utils/Stats';
import * as Discord from '../node_modules/discord.js';
import * as config from '../config.json';

import read from './functions/router';

const bot = new Discord.Client();
const token = config.token;

bot.login(token);

// Sanity log on login
bot.on('ready', () => {
  console.log('Logged in as %s - %s\n', bot.user.username, bot.user.id);
});


// Handles all incoming messages and parses them for a command
bot.on('message', (message) => {
  read(message);
});


// Handles reactions when added to messages
bot.on('messageReactionAdd', (reaction, user) => {
  Stats.CountReaction(reaction, user);
});

// Handles the deletion of emojis
bot.on('emojiDelete', (emoji) => {
  Stats.RemoveEmoji(emoji);
});