
/**
 *  Function that returns a normalized param
 * @param {string} word - param entered
 * @param {string} target - target normalized param
 * @returns a normalized param for switching the cases to ini sections
 */
function normalizeParam(word, target) {
    // this function checks the strings and compares, and return how close it is to the target
    function similarity(str1, str2) {
        const len = Math.max(str1.length, str2.length);
        // convert string to an array of separted letters/numbers, add an dummy in the index and compare how correct each letters are,
        // and evaluate how correct the input is,
        const dist = Array(len)
            .fill(0)
            .map((_, i) => (str1[i] === str2[i] ? 1 : 0))
            .reduce((acc, val) => acc + val, 0);
        return dist / len;
    }
    // this function returns a
    /**
     *
     * @param {string} input - param entered
     * @param {string} target - target param
     * @param {number} cutoff - 0.6 by default, est how correct should the param entered
     * @returns returns the target param if > 0.6 correct
     */
    function closeMatch(input, target, cutoff) {
        return similarity(input.toLowerCase(), target) > cutoff;
    }

    if (closeMatch(word, target, 0.6)) {
        return "profile";
    } else {
        return word.toLowerCase();
    }
}


normalizeParam('prof', 'profile')
module.exports = normalizeParam