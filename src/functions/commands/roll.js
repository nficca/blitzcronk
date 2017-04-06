import Command from '../../structures/Command';
import Random from '../../utils/Random';

export default (function() {
    try {
        return new Command({
            name: 'roll',
            args: ['n>d<d'],
            description: 'Rolls **n** **d**-sided dice, or picks a number between 1 and 100 if no arguments given'
        }, function(roll) {
            let result = Random.int(1, 100);

            if (roll && roll.length) {
                let inputs = roll.split('d');
                if (inputs.length === 2 && parseInt(inputs[0]) && parseInt([1])) {
                    let n = parseInt(inputs[0]);
                    let d = parseInt(inputs[1]);
                    if (n >= 1 && n <= 100 && d >= 2 && d <= 100) {
                        result = 0;
                        for (let i = 1; i <= n; ++i) {
                            result += Random.int(1, d);
                        }
                    }
                }
            }

            this.channel.sendMessage(`${this.user}: :game_die: ${result}`);
        });
    } catch (e) {
        console.error(e);
        return null;
    }
})();
