/**
 * commands.js
 *
 * Pulls every available command and export them as a part of a single array.
 * All commands must be imported to and exported from here in order to be used.
 */

import chatters from './commands/chatters';
import choose   from './commands/choose';
import echo     from './commands/echo';
import gif      from './commands/gif';
import gifr     from './commands/gifr';
import macro    from './commands/macro';
import ping     from './commands/ping';
import roll     from './commands/roll';
import stats    from './commands/stats';
import swearjar from './commands/swearjar';

export default [
    chatters,
    choose,
    echo,
    gif,
    gifr,
    macro,
    ping,
    roll,
    stats,
    swearjar
];
