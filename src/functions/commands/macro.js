import Command from '../../structures/Command';
import * as Discord from '../../../node_modules/discord.js';
import MacroCache from '../../utils/MacroCache';

export default (function() {
    try{
        return new Command({
            name: 'macro',
            args: ['add|remove|list','name?', '...action?'],
            description: '• **add** a macro with **name** that runs **action** when called\n' +
                            '• **remove** a macro with **name**\n' +
                            '• **list** all available macros'
        }, function(func, name, ...action) {
            // a add/remove/list was specified
            if (typeof func === 'string' && func.length && ['add', 'remove', 'list'].indexOf(func) > -1) {

                // get the macros
                MacroCache.GetMacros().then(macros => {

                    if (func === 'list') {
                        // if there are macros to list
                        if (macros.size > 0) {

                            // create an embed with each macro and their actions
                            let embed = new Discord.RichEmbed();

                            embed.setTitle(`List of Macros`);
                            embed.setDescription(`The following is a list of all available macros and their actions.`);

                            for (let [key, value] of macros.entries()) {
                                embed.addField(`/${key}`, value);
                            }

                            // send the embed
                            this.channel.sendEmbed(embed);
                        } else {
                            // no macros to list
                            this.channel.sendMessage('There are no macros.');
                        }
                    } else {

                        // both add and remove require a name so ensure that it's valid
                        if (typeof name === 'string' && name.length) {

                            // see if the name exists
                            let existing = macros.has(name);

                            if (func === 'add') {
                                // add/update the macro if an action is specified
                                if (action instanceof Array && action.join('').length) {
                                    MacroCache.AddMacro(name, action.join(" "));
                                    this.channel.sendMessage(`${existing ? 'Updated' : 'Added new'} macro: \`/${name}\`.`);
                                } else {
                                    this.channel.sendMessage(`${this.user}, you must specify an action for the macro.`);
                                }
                            } else {
                                // remove the macro if it exists
                                if (!existing) {
                                    this.channel.sendMessage(`${this.user}, there is no macro named \`${name}\`.`);
                                } else {
                                    MacroCache.RemoveMacro(name);
                                    this.channel.sendMessage(`Removed macro \`${name}\``);
                                }
                            }
                        } else {
                            // name was invalid
                            this.channel.sendMessage(`${this.user}, you must specify the name of the macro.`);
                        }
                    }
                });
            } else {
                // add/remove/list were not given or were invalid somehow
                this.channel.sendMessage(`${this.user}, you must specify if you want to \`add\` or \`remove\` a macro.`);
            }


        });
    } catch (e) {
        console.error(e);
        return null;
    }
})();
