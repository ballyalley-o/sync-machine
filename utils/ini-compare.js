

function compareArr(prevArr, modArr) {
  const changes = []

  let prevArrSplit = prevArr
  let modArrSplit = modArr

  if (!Array.isArray(prevArr) ) {
    prevArrSplit = prevArr.split('\n')
    modArrSplit = modArr.split('\n')
  }

  for (let i = 0; i < prevArrSplit.length || i < modArrSplit.length; i++) {
    if (i < prevArrSplit.length && i < modArrSplit.length) {
      if (prevArrSplit[i] !== modArrSplit[i]) {
        changes.push(
          `Line ${i + 1}: '${prevArrSplit[i]}' -> '${modArrSplit[i]}'`
        )
      }
    } else if (i < prevArrSplit.length) {
      changes.push(`Line ${i + 1}: '${prevArrSplit[i]}' -> Removed`)
    } else {
       return changes
    }
  }
  return changes
}

// TODO: will refactor this since this was logically incorrect, this was more of extractor
 // compare by param names instead of lines, add a different method: if the param has multiple include the tool names/parent name
function compareArrByProperty(prevArr, modArr) {
  const changes = []
  const prevPropsArray = []
  const modPropsArray = []
  const paramArray = []
  const iniArray = []
  const profileArray = []
  const properties = {}

  const keyValueArray = []
  let keyValue

  if (!Array.isArray(prevArr) || !Array.isArray(modArr)) {
    let prevLines = prevArr.split('\n')
    let modLines = modArr.split('\n')

    changes.push(prevLines)
    changes.push(modLines)

    return changes
  }

  let currentSection = null
  // get the param for the properties : i.e. [MachineParameters]
  for (const line of prevArr) {
    if (line.trim().startsWith('[') && line.trim().endsWith(']')) {
      currentSection = line.trim().slice(1, -1)
      paramArray.push(currentSection)

      // get all the profiles
      if (line.includes('Profile_')) {
        profileArray.push(line)
      }

      const [key, value] = line.split('=')

      if (key && value) {
        keyValue = [key, value]
        keyValueArray.push(keyValue)
        properties[key.trim()] = value.trim()
      }
      // this takes out all the properties of each section
    } else if (currentSection.includes('Switch_')) {

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
        console.log('existing')
      } else {
        // if key-value pair length is not more than 1 under a section, dont push it, just make it a value of the currentSection
        properties[currentSection].push({[keyTrimmed]: valueTrimmed})
        console.log(properties[currentSection], 'PROPS with currentsection')
      }
      }
    } else if (currentSection === paramArray[0]) {
      const [key, value] = line.split('=')

      prevArr.forEach(section => {
        if (key && value) {
          properties[key.trim()] = value.trim()
          iniArray.push(properties)
        }
      });
    }
  }

  const prevPropertyValues = prevArr.map((item) => {
    const [key, value] = item.split('=')
    if (key && value) {
      prevPropsArray.push(key)
    }
  })

  const modPropertyValues = modArr.map((item) => {
    const [key, value] = item.split('=')
    if (key && value) {
      modPropsArray.push(key)
    }
  })

  prevPropsArray.forEach((prevValue, index) => {
    if (modPropsArray[index] !== prevValue) {


      changes.push(`${prevValue}: '${prevValue}' -> '${modPropsArray[index]}'`)
    }
  })

  return properties
}


const compareActions = { compareArr, compareArrByProperty}

module.exports = compareActions