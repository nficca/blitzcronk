import Command from '../../structures/Command';
import Member from '../../structures/Member';
import Database from '../../utils/Database';
import Random from '../../utils/Random';
import * as Discord from '../../../node_modules/discord.js';
import * as _ from 'lodash';

export default (function() {
    try{
        return new Command({
            name: 'swearjar',
            args: [],
            description: 'Lists the top 10 most vulgar users'
        }, function() {
            Database.LoadCollection('users', (users) => {
                // find docs sorted by most profanities to lowest profanities
                let docs = users.chain().find().sort((user1, user2) => {

                    let profanity1 = _.get(user1, 'profanity'),
                        profanity2 = _.get(user2, 'profanity'),
                        totals1 = _.sum(_.values(profanity1)),
                        totals2 = _.sum(_.values(profanity2));

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
                    let member = new Member(docs[i], this.channel.guild);

                    // ensure that they are actually a guild member
                    if (member.guildMember) {
                        // format the output "row"
                        names += member.guildMember.user.username + '\n';
                        profanities += member.getTotalProfanityPoints() + '\n';
                        commons += member.getMostCommonProfanityType() + '\n';
                    }
                }

                // Create the embed message
                let embed = new Discord.RichEmbed();
                embed.setTitle('Top Swearers');
                embed.addField('Name', names, true);
                embed.addField('Profanity Points', profanities, true);
                embed.addField('Common Profanity Type', commons, true);
                embed.setColor(Random.color());

                this.channel.sendEmbed(embed);
            });
        });
    } catch (e) {
        console.error(e);
        return null;
    }
})();
