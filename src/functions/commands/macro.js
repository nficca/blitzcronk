import Command from '../../structures/Command';
import MacroCache from '../../utils/MacroCache';

export default (function() {
    try{
        return new Command({
            name: 'macro',
            args: ['add|remove','name', '...action?'],
            description: '**add** a macro with **name** that runs **action** when called,' +
                            ' or **remove** a macro with **name**.',
            examples: [
                '/macro add lol :laughing:\n' +
                    '/lol\n -> :laughing:',
                '/macro add p /ping\n' +
                    '/p -> issues /ping command'
            ]
        }, function(addremove, name, ...action) {
            // make sure all arguments are valid
            if (typeof addremove === 'string' && addremove.length &&
                typeof name === 'string' && name.length &&
                ['add', 'remove'].indexOf(addremove) > -1) {

                MacroCache.GetMacros().then(macros => {
                    let existing = macros.has(name);

                    if (addremove === 'add') {
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

                });
            } else {
                // determine which argument was invalid
                if (typeof name !== 'string' || !name.length) {
                    this.channel.sendMessage(`${this.user}, you must specify the name of the macro.`);
                } else {
                    this.channel.sendMessage(`${this.user}, you must specify if you want to \`add\` or \`remove\` a macro.`);
                }
            }


        });
    } catch (e) {
        console.error(e);
        return null;
    }
})();
