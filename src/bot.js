var discord = require('discord.io');
var bot = new discord.Client({
  autorun: true,
  token: "MjQ2ODI3NjcxNzM5MzAxODg4.CwgTyg.vd_Vxg5d4oVNTjsxgh4xp7chFr0"
});

bot.on('ready', function(event) {
  console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('message', function(user, userId, channelId, message, event) {
  if (message === 'ping') {
    bot.sendMessage({
      to: channelId,
      message: "pong!"
    });
  }
});
