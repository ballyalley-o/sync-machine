function extractBySection(arr, section) {
  const prevPropsArray = []
  const modPropsArray = []
  const profileArray = []
  const changes = []
  const paramArray = []
  const iniArray = []
  const properties = {}
  const keyValueArray = []
  let keyValue

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

      // const [key, value] = line.split('=')

      // if (key && value) {
      //   keyValue = [key, value]
      //   keyValueArray.push(keyValue)
      //   properties[key.trim()] = value.trim()
      // }

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
          // if key-value pair length is not more than 1 under a section, dont push it, just make it a value of the currentSection
          properties[currentSection].push({[keyTrimmed]: valueTrimmed})
        }

      }
    } else if (currentSection === paramArray[0]) {
      const [key, value] = line.split('=')

        arr.forEach(section => {
          if (key && value) {
            properties[key.trim()] = value.trim()
            iniArray.push(properties)
          }
        });
      }
    }
  return properties

  }




module.exports = extractBySection
