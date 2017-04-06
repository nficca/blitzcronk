/**
 * Utility class for doing operations involving random number generation
 */
class Random {
    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     *
     * @param {Number} min
     * @param {Number} max
     */
    static int(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Returns a random number between min (inclusive) and max (exclusive)
     *
     * @param {Number} min
     * @param {Number} max
     */
    static float(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Returns a random element in the list, or null if list is empty
     *
     * @param {Array} list
     */
    static element(list) {
        if (list.length) {
        return list[Math.floor(Math.random() * (list.length))];
        } else {
            return null;
        }
    }

    /**
     * Returns a random color in hex
     */
    static color() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16)
    }
}

export default Random;
