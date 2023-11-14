const { logger } = require("../middleware");

const targetArr = ['configurationformat','windowmode', 'profile', 'llcsocketdata','languageselect','textsizeselect', 'measurementsystem','machineparameters', 'llcparameters', 'label']



/**
 *  Function that returns a normalized param
 * @param {string} word - param entered
 * @param {string} target - target normalized param
 * @returns a normalized param for switching the cases to ini sections
 */
async function normalizeParam(word, targetArr) {
    const CUTOFF = 0.4
    // this function checks the strings and compares, and return how close it is to the target
    function similarity(str1, str2) {
        const len = Math.max(str1.length, str2.length);
        // convert string to an array of separted letters/numbers, add an dummy in the index and compare how correct each letters are,
        // and evaluate how correct the input is,
        const dist =  Array(len)
            .fill(0)
            .map((_, i) => (str1[i] === str2[i] ? 1 : 0))
            .reduce((acc, val) => acc + val, 0);

        console.log(dist, 'DIST')
        console.log(len, 'LENGTH')
        return dist / len;
    }
    /**
     * @param {string} input - param entered
     * @param {string} target - target param
     * @param {number} cutoff - 0.6 by default, est how correct should the param entered
     * @returns returns the target param if > 0.6 correct
     */
    // async function closeMatch(input, target, cutoff) {
    //     return await similarity(input.toLowerCase(), target) > cutoff;
    // }
    async function findClosest(input, targets, cutoff) {
        let closeMatch = null
        let maxSimilarity = 0

        for (const target of targets) {
            const sim = similarity(input.toLowerCase(), target)
            if (sim > cutoff && sim > maxSimilarity) {
                 closeMatch = target
                 maxSimilarity = sim
            }
         }
        return closeMatch
    }

  try {
    const result = await findClosest(word, targetArr, CUTOFF)
    // TODO: add these to responses constants
    if (result) {
        logger.info(`NORMALIZED ${word} to ${result}`)
        return result;
    } else {
        logger.error(`FAILED TO NORMALIZE ${word}`)
        return word.toLowerCase();
    }
  } catch (error) {
    logger.error(`FAILED TO NORMALIZE ${word}`)
     return word.toLowerCase();
  }
}


module.exports = normalizeParam