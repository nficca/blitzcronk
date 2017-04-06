import Command from '../structures/Command';
import * as Discord from '../../node_modules/discord.js';
import * as config from '../../config.json';

/**
 * returns the help command after being given all other commands in a mapping
 *
 * Note: this, unlike other command files, does NOT return the Command itself. Due to the fact
 * that 'help' requires information about all existing commands, this file provides a function
 * that is to be run with a mapping of all other commands. Any commands not included in this
 * mapping (excluding 'help' itself, which is hard-coded in here) will show up when issuing the
 * help command.
 *
 * @param {Map<String,Command>} commands
 */
export default (commands) => {
    try {
        const meta = {
            name: 'help',
            args: ['command?'],
            description: 'Show documentation for specific **command** or for all commands if none given'
        };

        return new Command(meta, function(command) {
            let embed = new Discord.RichEmbed();

            // if a command name was supplied and exists
            if (typeof command === 'string' && command.length && commands.has(command)) {
                // get the command
                let commandObj = commands.get(command);

                // fill out the embed
                embed.setTitle(`${config.prefix}${commandObj.name}` + (commandObj.args.length ? ` <${commandObj.args.join('> <')}>` : ''));
                embed.setDescription(commandObj.description);
            }

            // command name was 'help'
            // since help is being defined right now, we have to add it's entry separately from
            // from the existing commands
            else if (command === meta.name) {
                embed.setTitle(`${config.prefix}${meta.name}` + (meta.args.length ? ` <${meta.args.join('> <')}>` : ''));
                embed.setDescription(meta.description);
            }

            // no arguments or faulty arguments, so print all help docs for all commands
            else {
                // set up the embed for all commands
                embed.setTitle(`Commands`);
                embed.setDescription(`The following is a list of commands available for use in ${this.channel}.`);

                for (let commandObj of commands.values()) {
                    // list each command in a field
                    embed.addField(
                        `${config.prefix}${commandObj.name}` + (commandObj.args.length ? ` <${commandObj.args.join('> <')}>` : ''),
                        commandObj.description
                    );
                }
            }

            // send embed
            this.channel.sendEmbed(embed);
        });
    } catch (e) {
        console.error(e);
        return null;
    }
}