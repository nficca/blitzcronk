import Command from '../../structures/Command';

export default (function() {
    try {
        return new Command({
            name: 'echo',
            args: ['phrase'],
            description: 'Echoes the a text copy of **phrase**'
        }, function(...phrase) {
            this.channel.sendMessage(phrase.join(" "));
        });
    } catch (e) {
        console.error(e);
        return null;
    }
})();
