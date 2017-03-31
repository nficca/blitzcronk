const _     = require('lodash'),
      loki  = require('lokijs'),
      random = require('../helpers/random'),
      discord = require('discord.js'),
      profanity = require('../../profanity.json');

// Initialization
let db = new loki('db.json');

let loadCollection = (name, callback) => {
    db.loadDatabase({}, () => {
        let collection = db.getCollection(name);

        if (!collection) {
            console.log(`Collection ${name} does not exist. Creating new collection...`);
            collection = db.addCollection(name);
        }

        callback(collection);
    });
};

let calcLevel = (total_messages) => {
    return Math.max(1, Math.floor(
        ((-5/27) + Math.sqrt((25/729) - (100/9)*(-total_messages - 10/27)))/(50/9)
    ));
};

/**
 * [hide]
 * Gets the most used reaction emoji for a user
 * Returns the emoji in a format that can be printed on discord
 * Returns null if no emoji used
 *
 * @param user
 * @param {Client} client
 */
let getTopReaction = (user, client) => {
    let emoji_id = null;
    let most_used_count = 0;

    // return null when no reactions at all
    if (!_.get(user, 'reactions')) {
        return null;
    }

    // look for most frequent reaction
    else {
        for (let id in user.reactions) {
            if (user.reactions[id] > most_used_count) {
                emoji_id = id;
                most_used_count = user.reactions[id];
            }
        }
    }

    // only get emoji if not null
    if (emoji_id != null) {
        // try to do lookup to see if it's a custom emoji
        let custom_emoji = client.emojis.get(emoji_id);

        if (!custom_emoji) {
            // not a custom emoji so that means it's UTF-8 encoded emoji
            return decodeURIComponent(emoji_id);
        }
        return custom_emoji;
    }

    return null;
};

let getProfanities = (message) => {
    let words = message.toLowerCase().split(' ');
    let profanity_types = [];
    let profanity_counts = {};

    let obj = null;
    for (let i = 0; i < words.length; ++i) {
        // Check if current obj has next
        if (obj !== null && obj.next) {

            // Check if current word follows last word
            if (_.get(obj, 'next.' + words[i])) {
                // current word follows, point to current word
                obj = obj.next[words[i]];
            }
            // doesn't follow, but check if it's a profanity
            else if (profanity[words[i]]) {
                // check if last word was a profanity by itself
                if (obj !== null && obj.type !== null) {
                    profanity_types = profanity_types.concat(obj.type);
                }
                // point to current word because it's a profanity
                obj = profanity[words[i]]
            }
            // current word is not a profanity and doesn't follow
            else {
                if (obj.type !== null) profanity_types = profanity_types.concat(obj.type);
                obj = null;
            }
        }
        // is current word a profanity
        else if (profanity[words[i]]) {
            // check if last word was a profanity by itself
            if (obj !== null && obj.type !== null) {
                profanity_types = profanity_types.concat(obj.type);
            }
            // point to current word because it's a profanity
            obj = profanity[words[i]];
        }
        // current is not a profanity, check if last word was
        else if (obj !== null) {
            if (obj.type !== null) profanity_types = profanity_types.concat(obj.type);
            obj = null;
        }
    }

    // check if last word in message was a profanity
    if (obj !== null && obj.type !== null) {
        profanity_types = profanity_types.concat(obj.type);
    }

    for (let i = 0; i < profanity_types.length; ++i) {
        if (!profanity_counts[profanity_types[i]]) {
            profanity_counts[profanity_types[i]] = 1;
        } else {
            profanity_counts[profanity_types[i]]++;
        }
    }

    return profanity_counts;
};


module.exports = {
    /**
     * [hide]
     * Counts a message for the database
     *
     * @param {Message} msg
     */
    countMsg: (msg) => {
        let author = msg.author.toString();

        let profanity_use = getProfanities(msg.content);

        loadCollection('users', (users) => {
            let result = users.findOne({'author': author});
            if (!result || !Object.keys(result).length) {
                console.log(`Couldn't find user ${author} in database. Inserting...`);
                users.insert({
                    'author': author,
                    'total_messages': 1,
                    'level': 1,
                    'profanity': profanity_use,
                    'reactions': {}
                });
            } else {
                if (_.get(result, 'total_messages') && result.total_messages > 0) {
                    result.total_messages++;
                    let new_level = calcLevel(result.total_messages);
                    if (!_.get(result, 'level') || result.level !== new_level) {
                        result.level = new_level;
                        if (!msg.author.bot) {
                            msg.channel.sendMessage(`:tada: Congratulations ${author}, you are now Level ${new_level}! :tada:`);
                        }
                    }
                } else {
                    result.total_messages = 1;
                    result.level = 1;
                }

                if (!_.get(result, 'profanity') || typeof result.profanity !== "object") {
                    result.profanity = {};
                }

                for (let k in profanity_use) {
                    if (_.get(result, `profanity.${k}`)) {
                        result.profanity[k] += profanity_use[k];
                    } else {
                        result.profanity[k] = profanity_use[k];
                    }
                }


                users.update(result);
            }

            db.saveDatabase();
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
        let emoji_id = reaction.emoji.id !== null ? reaction.emoji.id : reaction.emoji.identifier;
        loadCollection('users', (users) => {
            let result = users.findOne({'author': user.toString()});

            // if user does not exist in DB then insert new entry
            if (!result || !Object.keys(result).length) {
                console.log(`Couldn't find user ${author} in database. Inserting...`);

                // initialize reactions field
                let reactions = {};
                reactions[emoji_id] = 1;

                // insert
                users.insert({
                    'author': user.toString(),
                    'total_messages': 0,
                    'level': 1,
                    'profanity': {},
                    'reactions': reactions
                });
            }

            // user does exist
            else {
                // initialize reactions field if not part of user entry
                if (!_.get(result, 'reactions') || typeof result.profanity !== "object") {
                    result.reactions = {};
                    result.reactions[emoji_id] = 1;
                }

                // add emoji to reactions
                else if (_.get(result, `reactions.${emoji_id}`)) {
                    result.reactions[emoji_id]++;
                } else {
                    result.reactions[emoji_id] = 1;
                }

                users.update(result);
            }

            db.saveDatabase();
        });
    },

    /**
     * /chatters
     * Gets the top 10 chatters in the server
     *
     * @param {Message} msg
     * @param {Array}   args
     */
    chatters: (msg, args) => {
        loadCollection('users', (users) => {
            let results = users.chain().find().simplesort('total_messages', true).limit(10).data();

            let names       = '';
            let messages    = '';
            let levels      = '';

            for (let i = 1; i <= results.length; ++i) {
                // get the actual user object
                let user = _.get(msg.channel.members.get(results[i - 1].author.replace(/[^\d]/g, '')), 'user');
                if (user) {
                    names += user.username + '\n';
                    messages += results[i - 1].total_messages + '\n';
                    levels += results[i - 1].level + '\n'
                }
            }

            // Create the embed message
            let embed = new discord.RichEmbed();
            embed.setTitle('Top Chatters');
            embed.addField('Name', names, true);
            embed.addField('Total Messages', messages, true);
            embed.addField('Level', levels, true);
            embed.setColor(random.color());

            msg.channel.sendEmbed(embed);
        });
    },

    /**
     * /stats
     * Displays your stats
     *
     * @param {Message} msg
     * @param {Array}   args
     */
    stats: (msg, args) => {
        let author = msg.author.toString();
        loadCollection('users', (users) => {
            let result = users.findOne({'author': author});
            if (!result || !Object.keys(result).length) {
                msg.channel.sendMessage(`${author}: You appear to have no stats... try again in a moment.`)
            } else {
                let result_msg = `${author}'s stats:\`\`\``;
                if (_.get(result, 'total_messages')) {
                    result_msg += `\nTotal messages: ${result.total_messages}`;
                }
                if (_.get(result, 'level')) {
                    result_msg += `\nCurrent level: ${result.level}`;
                }
                result_msg += '```';
                msg.channel.sendMessage(result_msg);
            }
        })
    },

    /**
     *  /swearjar
     *  Lists the top 10 most vulgar users
     *
     * @param {Message} msg
     * @param {Array}   args
     */
    swearjar: (msg, args) => {
        loadCollection('users', (users) => {
            let results = users.chain().find().sort((user1, user2) => {

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

            let names   = '';
            let pps     = '';
            let commons = '';

            for (let i = 1; i <= results.length; ++i) {
                // get the actual user object
                let user = _.get(msg.channel.members.get(results[i - 1].author.replace(/[^\d]/g, '')), 'user');
                if (user) {
                    names   += user.username + '\n';
                    pps     += _.sum(_.values(results[i - 1].profanity)) + '\n';
                    commons += _.keys(results[i - 1].profanity)[_.indexOf(_.values(results[i - 1].profanity), _.max(_.values(results[i - 1].profanity)))] + '\n';
                }
            }

            // Create the embed message
            let embed = new discord.RichEmbed();
            embed.setTitle('Top Swearers');
            embed.addField('Name', names, true);
            embed.addField('Profanity Points', pps, true);
            embed.addField('Common Profanity Type', commons, true);
            embed.setColor(random.color());

            msg.channel.sendEmbed(embed);
        });
    }
};
