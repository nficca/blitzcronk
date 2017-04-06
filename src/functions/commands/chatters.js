import Command from '../../structures/Command';
import Member from '../../structures/Member';
import Database from '../../utils/Database';
import Random from '../../utils/Random';
import * as Discord from '../../../node_modules/discord.js';

export default (function() {
    try{
        return new Command({
            name: 'chatters',
            args: [],
            description: 'Gets the top 10 chatters in the server'
        }, function() {
            Database.LoadCollection('users', (users) => {
                let docs = users.chain().find().simplesort('total_messages', true).limit(10).data();

                let names = '', messages = '', levels = '';

                for (let i = 0; i < docs.length; ++i) {
                    // get the Member object for this user
                    let member = new Member(docs[i], this.channel.guild);

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

                this.channel.sendEmbed(embed);
            });
        });
    } catch (e) {
        console.error(e);
        return null;
    }
})();
