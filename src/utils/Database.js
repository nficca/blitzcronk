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
     * @static
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
     * Modifies an oldDoc in a collection according to update.
     * The update's properties are pushed onto the oldDoc such that existing properties are overwritten and
     * non-existing properties are added.
     *
     * Note: Properties that exist on oldDoc but not in update WILL BE KEPT. This is because oldDoc has LokiJS-specific
     * properties that should not be modified in order to keep it unambiguous and individual.
     *
     * @param {Collection}  collection
     * @param {doc}         oldDoc
     * @param {object}      update
     * @static
     */
    static ModifyDocument(collection, oldDoc, update) {
        for (let prop in update) {
            oldDoc[prop] = update[prop];
        }
        collection.update(oldDoc);
        db.saveDatabase();
    }

    /**
     * Updates a collection of documents given the updated docs.
     *
     * @param {Collection} collection
     * @param {Array<doc>} updatedDocs
     * @static
     */
    static UpdateCollection(collection, updatedDocs) {
        collection.update(updatedDocs);
        db.saveDatabase();
    }
}

export default Database;
