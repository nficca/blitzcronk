import Command from '../../structures/Command';
import MacroCache from '../../utils/MacroCache';

export default (function() {
    try{
        return new Command({
            name: 'macroadd',
            args: ['name', '...action'],
            description: 'Creates a macro with **name** that runs **action** when called.',
            examples: [
                '/macroadd lol :laughing:\n' +
                    '/lol\n -> :laughing:',
                '/macroadd p /ping\n' +
                    '/p -> issues /ping command'
            ]
        }, function(name, ...action) {
            MacroCache.AddMacro(name, action.join(" "));
            this.channel.sendMessage(`Added new macro: \`/${name}\`.`);
        });
    } catch (e) {
        console.error(e);
        return null;
    }
})();
