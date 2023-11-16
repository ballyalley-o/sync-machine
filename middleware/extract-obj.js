
/**
 *
 * @param {string[]} arr - array of ini config parameters
 * @param {string} section - section to extract: Default is extract-all
 * @returns extracted sections and its keys and values as array
 */
function extractBySectionObj(arr, section) {
    const changes = []
    const paramArray = []
    const properties = {}

    if (!Array.isArray(arr)) {
      let arrLines = arr.split('\n')

      changes.push(arrLines)
      return changes
    }

    let currentSection = null
    // get the param for the properties : i.e. [MachineParameters]
    for (const line of arr) {
        if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
          currentSection = line.trim().slice(1, -1)
          paramArray.push(currentSection)

          // this takes out all the properties of each section
          } else if (currentSection.includes(section)) {

          const [key, value] = line.split('=')

           // if Profile_1 just push the key and value
        if (key && value) {
            const keyTrimmed = key.trim();
            const valueTrimmed = value.trim();

            if (!properties[currentSection]) {
                properties[currentSection] = {};
            }

            const existingKeyValue = properties[currentSection][keyTrimmed];

            if (existingKeyValue !== undefined) {
                // If the key already exists, update its value
                properties[currentSection][keyTrimmed] = valueTrimmed;
            } else {
                // If key-value pair length is not more than 1 under a section,
                // make it a value of the currentSection
                properties[currentSection][keyTrimmed] = valueTrimmed;
            }
        }

        }
      }
    return properties

    }

  module.exports = extractBySectionObj
