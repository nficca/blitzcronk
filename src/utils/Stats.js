import Database from './Database';
import Member from '../structures/Member';

/**
 * Utility class for working with user statistics
 */
class Stats {
    /**
     * Counts a message for the database
     *
     * @param {Message} message
     */
    static CountMessage(message) {
        let user = message.author;

        Database.LoadCollection('users', (users) => {
            let doc = users.findOne({'id': user.id});
            let member;

            // check if a document was found
            if (!doc || !Object.keys(doc).length) {
                console.log(`Couldn't find user ${user.id} in database. Inserting...`);

                // create a new member based on GuildMember id
                member = new Member({'id': user.id, total_messages: 1}, message.guild);

                // ensure the GuildMember was found
                if (member.guildMember) {
                    users.insert(member.json);
                } else {
                    console.error(`Cannot insert non-existent GuildMember ${user.id} into database.`);
                }
            } else {
                // create the Member object for this user
                member = new Member(doc, message.guild);

                // count the message
                member.countMessage(message);

                // update the document in the collection
                Database.UpdateCollection(users, doc, member.json);
            }
        });
    }

    /**
     * Counts a reaction for the database
     *
     * @param {MessageReaction} reaction
     * @param {User} user
     */
    static CountReaction(reaction, user) {
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
    }

    /**
     * Removes the emoji from each users list of reactions in the database
     *
     * @param {Emoji} emoji
     */
    static RemoveEmoji(emoji) {
        // // TODO: Uncomment and test when https://github.com/hydrabolt/discord.js/issues/1333 is resolved
        // Database.LoadCollection('users', (users) => {
        //     // find all users that had used the deleted emoji
        //     let results = users.where((user) => {
        //         return (_.get(user, 'reactions')) && user.reactions.hasOwnProperty("297158408463843328");
        //     });
        //
        //     // remove the deleted emoji from the users' reactions
        //     for (let i = 0; i < results.length; ++i) {
        //         console.log("Found a user.");
        //         delete results[i]['reactions']["297158408463843328"];
        //     }
        //
        //     Database.UpdateCollection(users, results);
        // });
    }
}

export default Stats;