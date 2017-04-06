/**
 * Represents a command that can be called by a user via a text channel
 */
class Command {
    /**
     * Creates a new command.
     * The action is a function which takes args as arguments.
     * The description should describe what the command does.
     * The examples should provide a list of examples (strings) that describe some of the
     * uses of the command.
     *
     * @param {String}      name
     * @param {Array}       args
     * @param {String?}     description
     * @param {Array?}      examples
     * @param {Function}    action
     */
    constructor({name, args, description = '', examples = []}, action) {
        if (typeof name !== 'string' || !name.length) {
            throw new Error("Commands must have names");
        }
        if (!(args instanceof Array)) {
            throw new TypeError("Command args must be given in an Array");
        }
        if (!action || {}.toString.call(action) !== '[object Function]') {
            throw new TypeError("Command action must be a function");
        }

        this.name = name;
        this.args = args;
        this.action = action;
        this.description = description;
        this.examples = examples;
    }

    /**
     * Calls the command's action.
     * Gives context of the user that sent the command and the channel it was sent in.
     *
     * @param {User}    user
     * @param {Channel} channel
     * @param {Array}   args
     */
    run(user, channel, args) {
        this.action.apply({user, channel}, args);
    }
}

export default Command;
