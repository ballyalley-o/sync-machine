const { RESPONSE } = require('../constants')
const { logger } = require('../middleware')

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
    const len = Math.max(str1.length, str2.length)
    // convert string to an array of separted letters/numbers, add an dummy in the index and compare how correct each letters are,
    // and evaluate how correct the input is,
    const dist = Array(len)
      .fill(0)
      .map((_, i) => (str1[i] === str2[i] ? 1 : 0))
      .reduce((acc, val) => acc + val, 0)

    //   TEST: material. remove for prod
    console.log(dist, 'DIST')
    console.log(len, 'LENGTH')
    return dist / len
  }
  /**
   * This function will loop in the targets array if which one is the closest to the param name, and return that param
   * @param {string} input - param entered
   * @param {string[]} targets - target param
   * @param {number} cutoff - 0.4 by default (declared on the top^), est how correct should the param entered
   * @returns returns the target param if > 0.4 correct
   */
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
    if (result) {
      logger.info(RESPONSE.success.normalized(word, result))
      return result
    } else {
      logger.error(RESPONSE.error.failedNormalize(word))
      return word.toLowerCase()
    }
  } catch (error) {
    logger.error()
    return word.toLowerCase()
  }
}

function switchParam(param, section) {
  switch (section) {
    case 'profile':
      param = 'Profile'
      break
    case 'machineparameters':
      param = 'MachineParameters'
      break
    case 'llc':
      param = 'LLC'
      break
    case 'windowmode':
      param = 'WindowMode'
      break
    case 'llcsocketdata':
      param = 'LLCSocketData'
      break
    case 'languageselect':
      param = 'LanguageSelect'
      break
    case 'textsizeselect':
      param = 'TextSizeSelect'
      break
    case 'measurementsystem':
      param = 'MeasurementSystem'
      break
    case 'llcparameters':
      param = 'LLCParameters'
      break
    case 'labelprinter':
      param = 'LabelPrinter'
      break
    case 'emaillist':
      param = 'EmailList'
      break
    case 'emailconnection':
      param = 'EmailConnection'
      break
    case 'toolpositionlimits':
      param = 'ToolPositionLimits'
      break
    case 'tooldef':
      param = 'ToolDef_'
      break
    case 'analoguedisplay':
      param = 'Analogue_Display'
      break
    case 'switch':
      param = 'Switch'
      break
    case 'settings':
      param = 'Settings'
      break
    default:
      param = null
  }
  return param
}

const normalize = { normalizeParam, switchParam }
module.exports = normalize
