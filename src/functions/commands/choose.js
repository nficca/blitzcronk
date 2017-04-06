import Command from '../../structures/Command';
import Random from '../../utils/Random';

export default (function() {
    try{
        return new Command({
            name: 'choose',
            args: ['...choices'],
            description: 'Chooses between given **choices**'
        }, function(...choices) {
            this.channel.sendMessage(Random.element(choices));
        });
    } catch (e) {
        console.error(e);
        return null;
    }
})();
