function extractBySection(arr, section) {
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
            const keyTrimmed = key.trim()
            const valueTrimmed = value.trim()

            if (!properties[currentSection]) {
                properties[currentSection] = []
            }
          const existingKeyValue = properties[currentSection].find(item => {
            const popKeys = Object.keys(item).pop().trim()
            popKeys === keyTrimmed
          })
          if (existingKeyValue) {
            existingKeyValue[keyTrimmed] = valueTrimmed

          } else {
        // if key-value pair length is not more than 1 under a section, dont push it, isntead,
        //  make it a value of the currentSection
            properties[currentSection].push({[keyTrimmed]: valueTrimmed})
          }
        }
      }
    }
  return properties

  }




module.exports = extractBySection
