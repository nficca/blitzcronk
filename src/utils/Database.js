import Loki from 'lokijs';

const db = new Loki('db.json');

/**
 * Performs tasks pertaining to Database data
 */
class Database {
    /**
     * Loads a collection and performs callback on it
     *
     * @param {String}      name
     * @param {Function}    callback
     */
    static LoadCollection(name, callback) {
        db.loadDatabase({}, () => {
            let collection = db.getCollection(name);

            if (!collection) {
                console.log(`Collection ${name} does not exist. Creating new collection...`);
                collection = db.addCollection(name);
            }

            callback(collection);

            db.saveDatabase();
        })
    }

    /**
     * Updates a collection's old doc with update.
     * The update's properties are pushed onto the oldDoc such that existing properties are overwritten and
     * non-existing properties are added.
     *
     * @param {Collection}  collection
     * @param {doc}         oldDoc
     * @param {object}         update
     */
    static UpdateCollection(collection, oldDoc, update) {
        for (let prop in update) {
            oldDoc[prop] = update[prop];
        }
        collection.update(oldDoc);
        db.saveDatabase();
    }
}

export default Database;
