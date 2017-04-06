import Command from '../../structures/Command';

export default (function() {
    try {
        return new Command({
            name: 'ping',
            args: [],
            description: 'Responds with \'pong!\''
        }, function() {
            this.channel.sendMessage('pong!');
        });
    } catch (e) {
        console.error(e);
        return null;
    }
})();
