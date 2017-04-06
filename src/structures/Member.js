import * as _ from 'lodash';
import * as profanity from '../../profanity.json';

/**
 * Represents a member in the channel
 */
class Member {
    /**
     *
     * @param {string} id
     * @param {number} total_messages
     * @param {number} level
     * @param {object} profanity
     * @param {object} reactions
     *
     * @param {Guild} guild
     */
    constructor({id, total_messages = 0, level = 1, profanity = {}, reactions = {}}, guild) {
        try {
            /**
             * @type {GuildMember} guildMember
             */
            this.guildMember = guild.members.get(id);

            // the GuildMember must exist
            if (!this.guildMember) {
                this.guildMember = null;
                console.error(`Cannot find guild member with id: ${id}`);
            }

            this.totalMessages = total_messages;
            this.level = level;
            this.profanity = profanity;
            this.reactions = reactions;

            this.role = this._getRole();
        } catch (e) {
            console.error(`Error creating member with id: ${id}`);
            console.error(e);
        }

    }

    /**
     * Returns a json version of this object (for database-entry)
     */
    get json() {
        return {
            "id": this.guildMember.id,
            "total_messages": this.totalMessages,
            "level": this.level,
            "profanity": this.profanity,
            "reactions": this.reactions
        }
    }

    /**
     * Performs necessary operations given that this member sent a new message
     * If silent is set to true, then any bot messages that would be sent as a result of this new message are not sent
     *
     * @param {Message} message
     * @param {boolean} silent
     */
    countMessage(message, silent = false) {
        // increment total messages
        this.totalMessages++;

        // update level while still temporarily remembering old level (to know if it changed)
        let oldLevel = this.level;
        this._updateLevel();

        // check if level changed
        if (this.level !== oldLevel && !silent && !this.guildMember.user.bot) {
            message.channel.sendMessage(`:tada: Congratulations ${this.guildMember.user}, you are now Level ${this.level}! :tada:`);
        }

        // count the profanities
        this._addProfanities(message);
    }

    /**
     * Updates the member's reactions structure with new reaction
     *
     * @param {MessageReaction} reaction
     */
    addReaction(reaction) {
        let id = reaction.emoji.id !== null ? reaction.emoji.id : reaction.emoji.identifier;

        if (this.reactions.hasOwnProperty(id)) {
            this.reactions[id]++;
        } else {
            this.reactions[id] = 1;
        }
    }

    /**
     * Gets the n most used reaction emojis
     * Set include_counts to true if you want the number of uses per reaction included in the results
     * Returns the emojis in a format that can be printed on discord
     * Returns [] if no emojis used or if there was an error
     *
     * @param {Number} n
     * @param {Boolean} include_counts
     */
    getTopReactions(n = 1, include_counts = false) {

        // sort the reactions by most used to least used
        let sorted_reactions = _.map(this.reactions, (value, key) => [key, value]).sort((a, b) => b[1] - a[1]);
        let top_reactions = sorted_reactions.slice(0, n);

        for (let i = top_reactions.length - 1; i >= 0; --i) {
            // only get emoji if not null
            if (top_reactions[i][0] !== null) {
                // try to do lookup to see if it's a custom emoji
                let custom_emoji = this.guildMember.guild.emojis.get(top_reactions[i][0]);

                if (!custom_emoji) {
                    // not a custom emoji so that means it's probably a UTF-8 encoded emoji...
                    if (decodeURIComponent(top_reactions[i][0]) === top_reactions[i][0]) {
                        // ...but decoding did nothing, so remove the emoji because it's broken
                        top_reactions.splice(i, 1);
                    } else {
                        // if it did decode then it must have became the actual emoji so use that
                        top_reactions[i][0] = decodeURIComponent(top_reactions[i][0]);
                    }
                } else {
                    top_reactions[i][0] = custom_emoji;
                }
            }
        }

        return include_counts ? top_reactions : _.map(top_reactions, (reaction) => reaction[0]);
    }

    /**
     * Gets the total profanity points for member
     */
    getTotalProfanityPoints() {
        return _.sum(_.values(this.profanity));
    }

    /**
     * Gets the most common profanity type for member
     */
    getMostCommonProfanityType() {
        if (Object.keys(this.profanity).length) {
            return _.keys(this.profanity)[_.indexOf(_.values(this.profanity), _.max(_.values(this.profanity)))];
        } else {
            return '';
        }
    }

    /**
     * Returns the highest role of the member
     *
     * @private
     */
    _getRole() {
        // get list of all of member's roles
        let roles = this.guildMember.roles.array();
        let role = roles[0];

        // find highest role
        for (let i = 1; i < roles.length; ++i) {
            if (role.comparePositionTo(roles[i]) < 0) {
                role = roles[i];
            }
        }

        return role;
    }

    /**
     * Calculates level of member
     *
     * @private
     */
    _updateLevel() {
        this.level = Math.max(1, Math.floor(
            ((-5/27) + Math.sqrt((25/729) - (100/9)*(-this.totalMessages - 10/27)))/(50/9)
        ));
    }

    /**
     * Parses a message for profanities and tallies them into the profanity structure
     *
     * @param {Message} message
     * @private
     */
    _addProfanities(message) {
        let words = message.content.toLowerCase().split(' ');
        let profanity_types = [];

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

        // tally the profanities into the structure
        for (let i = 0; i < profanity_types.length; ++i) {
            if (!this.profanity[profanity_types[i]]) {
                this.profanity[profanity_types[i]] = 1;
            } else {
                this.profanity[profanity_types[i]]++;
            }
        }
    }
}

export default Member;
