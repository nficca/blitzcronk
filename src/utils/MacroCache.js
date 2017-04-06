import Database from './Database';

let _macros = null;

/**
 * Singleton for managing user-created macros.
 * Persistence achieved via database.
 */
class MacroCache {
    /**
     * Gets a map of all available macros
     *
     * @returns {Promise<Map<String,String>>}
     * @static
     */
    static GetMacros() {

        return new Promise((resolve, reject) => {
            if (!_macros) {
                try {
                    /**
                     * Map of all available macros
                     * @type {Map<String,String>} macros
                     * @private
                     */
                    _macros = new Map();

                    Database.LoadCollection('macros', (macros) => {
                        let docs = macros.find();

                        if (docs && docs.length) {
                            for (let doc of docs) {
                                _macros.set(decodeURIComponent(doc.name), decodeURIComponent(doc.action));
                            }
                        }

                        resolve(_macros);
                    });
                } catch (e) {
                    console.error(e);
                    reject(e);
                }
            } else {
                resolve(_macros);
            }
        });
    }

    /**
     * Adds a macro with name and action to the macro cache.
     *
     * @param {String} name
     * @param {String} action
     * @static
     */
    static AddMacro(name, action) {
        if (typeof name !== 'string' || typeof action !== 'string' || !name.length || !action.length) {
            return;
        }

        this.GetMacros().then(macros => {
            macros.set(name, action);

            let encoded_name = encodeURIComponent(name);
            let encoded_action = encodeURIComponent(action);

            Database.LoadCollection('macros', (macroCollection) => {
                let doc = macroCollection.findOne({name: encoded_name});

                if (!doc || !Object.keys(doc).length) {
                    console.log(`Couldn't find macro "${encoded_name}" in database. Inserting...`);

                    macroCollection.insert({
                        name: encoded_name,
                        action: encoded_action
                    });
                } else {
                    Database.ModifyDocument(macroCollection, doc, {action: encoded_action});
                }
            });
        });
    }

    /**
     * Removes macro with name from the macro cache.
     *
     * @param {String} name
     * @static
     */
    static RemoveMacro(name) {
        if (typeof name !== 'string' || !name.length) {
            return;
        }

        this.GetMacros().then(macros => {
            if (macros.has(name)) {
                macros.delete(name);
            }

            let encoded_name = encodeURIComponent(name);

            Database.LoadCollection('macros', (macroCollection) => {
                macroCollection.findAndRemove({name: encoded_name});
                console.log(`Removed any macro with name "${encoded_name}".`);
            });
        })
    }


}

export default MacroCache;