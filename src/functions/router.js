/**
 * router.js
 *
 * Defines map of all usable commands.
 * Routes messages to correct command function.
 */

import Stats from '../utils/Stats';
import * as config from '../../config.json';
import commands_list from './commands';
import create_help_command from './create-help-command';
import quote from 'shell-quote';

/**
 * List of all available commands
 * @type {Map<String,Command>}
 */
let commands = new Map();

// add each command to the command mapping
for (let command of commands_list) {
    if (command) {
        commands.set(command.name, command);
    }
}

// create the help command separately since we need all the previous commands' metadata first
let help = create_help_command(commands);
commands.set(help.name, help);


/**
 * Reads a message and parses it for a command.
 * Runs the command if one is found.
 *
 * @param {Message} message
 */
let read = message => {
    let prefix_regex      = new RegExp('^' + config.prefix + '[a-zA-Z0-9_]+');

    // check if prefix is at beginning of message and that it wasn't sent by a bot
    if (prefix_regex.test(message.content) && !message.author.bot) {
        // split message into components
        let components = quote.parse(message.content.substring(config.prefix.length));

        // check if command exists
        if (commands.has(components[0])) {
            // run command
            commands.get(components[0]).run(message.author, message.channel, components.slice(1));
        } else {
            // inform user that command doesn't exist
            message.reply(`\`${components[0]}\` is not a command.`).catch(console.error);
        }
    } else {
        // tally normal message
        Stats.CountMessage(message);
    }
};

export default read;