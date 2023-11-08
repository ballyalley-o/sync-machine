function extractBySection(arr, section) {
  const changes = []
  const prevPropsArray = []
  const modPropsArray = []
  const paramArray = []
  const iniArray = []
  const profileArray = []
  const properties = {}
  const keyValueArray = []
  let keyValue
  let arrLines = []
  let sectionArray = []

  if (!Array.isArray(arr)) {
    arrLines = arr.split('\n')
    changes.push(arrLines)
  }

  let currentSection = null
  let arrSectionValues = []

  // get the param for the properties : i.e. [MachineParameters]
  for (const line of arr) {
    if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
      currentSection = line.trim().slice(1, -1)
      paramArray.push(currentSection)

      // get all the profiles
      if (line.includes(section)) {
        sectionArray.push(line)
      }


      // const propertyMatch = line.match(/([^=]+)/)
      const [key, value] = line.split('=')
      // if Profile_1 just push the key and value
      if (key && value) {
        keyValue = [key, value]
        keyValueArray.push(keyValue)
        properties[key.trim()] = value.trim()
        sectionArray.push(keyValueArray)
      }
      // this takes out all the properties of each section
    } else if (currentSection === section) {
      // const propertyMatch = line.match(/([^=]+)/)
      paramArray.map((section) => {
        const [key, value] = section.split('=')
        // if Profile_1 just push the key and value
        if (key && value) {
          keyValue = [key, value]
          keyValueArray.push(keyValue)
          properties[key.trim()] = value.trim()
          sectionArray.push(keyValueArray)
        }
      })
    }
  }

  console.log(section, 'section')
  console.log(keyValueArray, 'keyValueArray')
//   console.log(paramArray, 'param array')

  return properties
}



module.exports = extractBySection
