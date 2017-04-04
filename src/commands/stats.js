import Database from '../static/Database';
import Random from '../static/Random';
import Member from '../structures/Member';

import * as Discord from '../../node_modules/discord.js';
import * as _ from 'lodash';

module.exports = {
    /**
     * [hide]
     * Counts a message for the database
     *
     * @param {Message} msg
     */
    countMsg: (msg) => {
        let user = msg.author;

        Database.LoadCollection('users', (users) => {
            let doc = users.findOne({'id': user.id});
            let member;

            // check if a document was found
            if (!doc || !Object.keys(doc).length) {
                console.log(`Couldn't find user ${user.id} in database. Inserting...`);

                // create a new member based on GuildMember id
                member = new Member({'id': user.id, total_messages: 1}, msg.guild);

                // ensure the GuildMember was found
                if (member.guildMember) {
                    users.insert(member.json);
                } else {
                    console.error(`Cannot insert non-existent GuildMember ${user.id} into database.`);
                }
            } else {
                // create the Member object for this user
                member = new Member(doc, msg.guild);

                // count the message
                member.countMessage(msg);

                // update the document in the collection
                Database.UpdateCollection(users, doc, member.json);
            }
        });
    },

    /**
     * [hide]
     * Counts a reaction for the database
     *
     * @param {MessageReaction} reaction
     * @param {User} user
     */
    countReaction: (reaction, user) => {
        // get the emoji's id (custom emojis) or the emoji's identifier (unicode emojis)
        let emoji_id = reaction.emoji.id !== null ? reaction.emoji.id : reaction.emoji.identifier;

        Database.LoadCollection('users', (users) => {
            let doc = users.findOne({'id': user.id});
            let member;

            // check if a document was found
            if (!doc || !Object.keys(doc).length) {
                console.log(`Couldn't find user ${user.id} in database. Inserting...`);

                // initialize reactions field
                let reactions = {[emoji_id]: 1};

                // create a new member based on GuildMember id
                member = new Member({'id': user.id, reactions}, reaction.message.guild);

                // ensure the GuildMember was found
                if (member.guildMember) {
                    users.insert(member.json);
                } else {
                    console.error(`Cannot insert non-existent GuildMember ${user.id} into database.`);
                }
            } else {
                // create the Member object for this user
                member = new Member(doc, reaction.message.guild);

                // count the message
                member.addReaction(reaction);

                // update the document in the collection
                Database.UpdateCollection(users, doc, member.json);
            }
        });
    },

    /**
     * [hide]
     * Removes the emoji from each users list of reactions
     *
     * @param {Emoji} emoji
     */
    // // TODO: Uncomment and test when https://github.com/hydrabolt/discord.js/issues/1333 is resolved
    // removeEmojiFromDB: (emoji) => {
    //     console.log("Start");
    //     Database.LoadCollection('users', (users) => {
    //         // find all users that had used the deleted emoji
    //         let results = users.where((user) => {
    //             return (_.get(user, 'reactions')) && user.reactions.hasOwnProperty("297158408463843328");
    //         });
    //
    //         // remove the deleted emoji from the users' reactions
    //         for (let i = 0; i < results.length; ++i) {
    //             console.log("Found a user.");
    //             delete results[i]['reactions']["297158408463843328"];
    //         }
    //
    //         Database.UpdateCollection(users, results);
    //     });
    // },

    /**
     * /chatters
     * Gets the top 10 chatters in the server
     *
     * @param {Message} msg
     * @param {Array}   args
     */
    chatters: (msg, args) => {
        Database.LoadCollection('users', (users) => {
            let docs = users.chain().find().simplesort('total_messages', true).limit(10).data();

            let names = '', messages = '', levels = '';

            for (let i = 0; i < docs.length; ++i) {
                // get the Member object for this user
                let member = new Member(docs[i], msg.guild);

                // ensure that they are actually a guild member
                if (member.guildMember) {
                    // due the way fields in embeds work, this is the only way to simulate a "row"
                    // as far as I can think of :(
                    // Note: this will visually break if the line-heights for each entry are not all the same
                    names += member.guildMember.user.username + '\n';
                    messages += member.totalMessages + '\n';
                    levels += member.level + '\n'
                }
            }

            // Create the embed message
            let embed = new Discord.RichEmbed();
            embed.setTitle('Top Chatters');
            embed.addField('Name', names, true);
            embed.addField('Total Messages', messages, true);
            embed.addField('Level', levels, true);
            embed.setColor(Random.color());

            msg.channel.sendEmbed(embed);
        });
    },

    /**
     * /stats <user>
     * Displays your stats if no arguments or the user given's stats
     *
     * @param {Message} msg
     * @param {Array}   args
     */
    stats: (msg, args) => {
        let user = msg.author;

        // if another user specified, look for them
        if (args.length) {
            let username = args.join(" ");

            // see if user is in guild
            let result = msg.guild.members.find(member => member.user.username === username);

            // if user is in guild then they are the user too look up stats about
            if (result) {
                user = result.user;
            }

            // a username was given but they're not in the guild
            else {
                // do one last case-insensitive check to make sure
                result = msg.guild.members.find(member => member.user.username.toLocaleLowerCase() === username.toLowerCase());
                if (result) {
                    user = result.user;
                } else {
                    // user can't be found
                    msg.channel.send(`I don't know any ${username}, did you misspell their name?`);
                    return;
                }
            }
        }

        Database.LoadCollection('users', (users) => {
            let doc = users.findOne({'id': user.id});

            // ensure user exists
            if (!doc || !Object.keys(doc).length) {
                msg.channel.sendMessage(`${user} appears to have no stats. If they chat some more, I'll be able to collect their stats.`)
            } else {
                // create the Member object for this user
                let member = new Member(doc, msg.guild);

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

                msg.channel.sendEmbed(embed);
            }
        })
    },

    /**
     * /swearjar
     * Lists the top 10 most vulgar users
     *
     * @param {Message} msg
     * @param {Array}   args
     */
    swearjar: (msg, args) => {
        Database.LoadCollection('users', (users) => {
            // find docs sorted by most profanities to lowest profanities
            let docs = users.chain().find().sort((user1, user2) => {

                let profanity1 = _.get(user1, 'profanity'),
                    profanity2 = _.get(user2, 'profanity'),
                    totals1    = _.sum(_.values(profanity1)),
                    totals2    = _.sum(_.values(profanity2));

                // make sure both users have made profanities, if not, rank accordingly
                if (!profanity1 && !profanity2) return 0;
                if (!profanity2) return -1;
                if (!profanity1) return 1;

                // check which user has used the most profanities
                if (totals1 === totals2) return 0;
                if (totals1 > totals2) return -1;
                if (totals1 < totals2) return 1;

            }).limit(10).data();

            let names = '', profanities = '', commons = '';

            for (let i = 0; i < docs.length; ++i) {
                // create the Member object for this user
                let member = new Member(docs[i], msg.guild);

                // ensure that they are actually a guild member
                if (member.guildMember) {
                    // format the output "row"
                    names       += member.guildMember.user.username + '\n';
                    profanities += member.getTotalProfanityPoints() + '\n';
                    commons     += member.getMostCommonProfanityType() + '\n';
                }
            }

            // Create the embed message
            let embed = new Discord.RichEmbed();
            embed.setTitle('Top Swearers');
            embed.addField('Name', names, true);
            embed.addField('Profanity Points', profanities, true);
            embed.addField('Common Profanity Type', commons, true);
            embed.setColor(Random.color());

            msg.channel.sendEmbed(embed);
        });
    }
};
