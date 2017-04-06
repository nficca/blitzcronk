import Command from '../../structures/Command';
import Member from '../../structures/Member';
import Database from '../../utils/Database';
import Random from '../../utils/Random';
import * as Discord from '../../../node_modules/discord.js';

export default (function() {
    try{
        return new Command({
            name: 'stats',
            args: ['username?'],
            description: 'Displays the stats for **username** if given, otherwise displays your stats'
        }, function(...username) {
            let user = this.user;

            // if another user specified, look for them
            if (username && username.length) {
                username = username.join(" ");

                // see if user is in guild
                let result = this.channel.guild.members.find(member => member.user.username === username);

                // if user is in guild then they are the user too look up stats about
                if (result) {
                    user = result.user;
                }

                // a username was given but they're not in the guild
                else {
                    // do one last case-insensitive check to make sure
                    result = this.channel.guild.members.find(member => member.user.username.toLocaleLowerCase() === username.toLowerCase());
                    if (result) {
                        user = result.user;
                    } else {
                        // user can't be found
                        this.channel.send(`I don't know any ${username}, did you misspell their name?`);
                        return;
                    }
                }
            }

            Database.LoadCollection('users', (users) => {
                let doc = users.findOne({'id': user.id});

                // ensure user exists
                if (!doc || !Object.keys(doc).length) {
                    this.channel.sendMessage(`${user} appears to have no stats. If they chat some more, I'll be able to collect their stats.`)
                } else {
                    // create the Member object for this user
                    let member = new Member(doc, this.channel.guild);

                    let profanities = [];

                    // format for each type of profanity the member has used
                    for (let type in member.profanity) {
                        profanities.push(`${member.profanity[type]} ${type} point${member.profanity[type] !== 1 ? 's' : ''}`);
                    }
                    if (profanities.length) {
                        profanities = profanities.join("\n");
                    } else {
                        profanities = 'No profanity points!';
                    }

                    // get the top 5 reactions of the user and format
                    let top_reactions = member.getTopReactions(5);
                    if (top_reactions.length) {
                        top_reactions = top_reactions.join(" ");
                    } else {
                        top_reactions = 'No reactions!';
                    }

                    // format the total messages
                    let messages = `${member.totalMessages} message${member.totalMessages !== 1 ? 's' : ''}`;

                    // Create the embed message
                    let embed = new Discord.RichEmbed();
                    embed.setTitle(`${user.username}'s stats`);
                    embed.setDescription(`${member.role} | ${messages} | Level **${doc.level}**`);
                    embed.setThumbnail(user.avatarURL);
                    embed.addField('Profanity Points', profanities, true);
                    embed.addField('Top Reactions', top_reactions, true);
                    embed.setColor(member.role.hexColor ? member.role.hexColor : Random.color());

                    this.channel.sendEmbed(embed);
                }
            });
        });
    } catch (e) {
        console.error(e);
        return null;
    }
})();
