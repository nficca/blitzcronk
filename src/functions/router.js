/**
 * router.js
 *
 * Defines map of all usable commands.
 * Routes messages to correct command function.
 */

import Stats from '../utils/Stats';
import * as config from '../../config.json';
import commands_list from './commands';
import createHelpCommand from './create-help-command';
import MacroCache from '../utils/MacroCache';
import quote from 'shell-quote';

const prefix_regex = new RegExp('^' + config.prefix + '[a-zA-Z0-9_]+');

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
let help = createHelpCommand(commands);
commands.set(help.name, help);


/**
 * Parses text with a command and runs the command if one exists.
 * Returns true if a command is run, and false otherwise.
 *
 * The original message object must be passed separately from the text so that the parsing
 * of the text can be recursive and still use the original message.
 *
 * @param {Message} originalMessage
 * @param {string}  text
 */
let parseCommandMessageText = (originalMessage, text) => {

    // split message into components
    let components = quote.parse(text.substring(config.prefix.length));

    // check if command exists
    if (commands.has(components[0])) {
        // run command
        commands.get(components[0]).run(originalMessage.author, originalMessage.channel, components.slice(1));
    }

    else {
        MacroCache.GetMacros().then(macros => {
            // check if command is a macro
            if (macros.has(components[0])) {
                let action = macros.get(components[0]);

                if (prefix_regex.test(action)) {
                    let action_args = components.slice(1).length ? ` ${components.slice(1).join(" ")}` : '';

                    // see if there is a valid command in the action (plus the rest of the message) and run it if so
                    parseCommandMessageText(originalMessage, action + action_args);
                } else {
                    // action is not attempting to use a command so just send the action as message
                    originalMessage.channel.sendMessage(action);
                }
            } else {
                // no command/macro was able to be found
                originalMessage.reply(`\`${components[0]}\` is not a command.`).catch(console.error);
                return false;
            }
        }).catch(error => {
            console.error(error);
            return false;
        });
    }

    // command/macro was found and run
    return true;
};


/**
 * Reads a message and parses it for a command.
 * Runs the command if one is found.
 *
 * @param {Message} message
 */
let read = message => {
    // check if prefix is at beginning of message and that it wasn't sent by a bot
    if (prefix_regex.test(message.content) && !message.author.bot) {
        // attempt to parse and run the command
        parseCommandMessageText(message, message.content);
    } else {
        // tally normal message
        Stats.CountMessage(message);
    }
};

export default read;