const _     = require('lodash'),
      loki  = require('lokijs');

// Initialization
let db = new loki('db.json');

let loadCollection = (name, callback) => {
    db.loadDatabase({}, () => {
        let collection = db.getCollection(name);

        if (!collection) {
            console.log(`Collection ${name} does not exist. Creating new collection...`);
            collection = db.addCollection(name);
        }

        callback(collection);
    });

    db.saveDatabase();
};

module.exports = {
    /**
     * [hide]
     * Counts a message for the database
     *
     * @param {Message} msg
     */
    countMsg: (msg) => {
        let author = msg.author.toString();

        loadCollection('users', (users) => {
            let result = users.findOne({'author': author});
            if (!result || result.length == 0) {
                console.log(`Couldn't find user ${author} in database. Inserting...`);
                users.insert({
                    'author': author,
                    'total_messages': 1
                });
            } else {
                if (_.get(result, 'total_messages') && result.total_messages > 0) {
                    result.total_messages++;
                } else {
                    result.total_messages = 1;
                }

                users.update(result);
            }
        });
    },

    /**
     * /chatters
     * Gets the top 10 chatters in the server
     *
     * @param {Message} msg
     * @param {Array}   args
     */
    chatters: (msg, args) => {
        loadCollection('users', (users) => {
            let results = users.chain().find().simplesort('total_messages', true).limit(10).data();
            let result_msg = 'The top chatters in this server are:';
            for (let i = 1; i <= results.length; ++i) {
                result_msg += `\n${i}. ${results[i - 1].author} - ${results[i - 1].total_messages} messages`;
            }
            msg.channel.sendMessage(result_msg);
        })
    }
};
