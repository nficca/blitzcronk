module.exports = {
    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     *
     * @param {Number} min
     * @param {Number} max
     */
    int: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Returns a random number between min (inclusive) and max (exclusive)
     *
     * @param {Number} min
     * @param {Number} max
     */
    float: (min, max) => {
        return Math.random() * (max - min) + min;
    },

    /**
     * Returns a random element in the list, or null if list is empty
     *
     * @param {Array} list
     */
    element: (list) => {
        if (list.length) {
            return list[Math.floor(Math.random() * (list.length + 1))];
        } else {
            return null;
        }
    }
};