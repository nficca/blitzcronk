import Command from '../../structures/Command';
import giphy_api from 'giphy-api'

export default (function() {
    try{
        return new Command({
            name: 'gif',
            args: ['query'],
            description: 'Searches giphy for a gif that matches the **query**'
        }, function(...query) {
            giphy_api().search(query.join(" "), (err, res) => {
                if (!err && res.data.length) {
                    this.channel.sendMessage(res.data[0].url);
                } else {
                    this.channel.sendMessage(`${this.user}, Your search for \`${query.join(" ")}\` didn't yield any results! :sob:`);
                }
            });
        });
    } catch (e) {
        console.error(e);
        return null;
    }
})();
