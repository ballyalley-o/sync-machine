const { logger } = require('../middleware')


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

function compareArrByProperty(prevArr, modArr) {
  const changes = []
  const prevPropsArray = []
  const modPropsArray = []
  const paramArray = []
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
      // this takes out all the properties of each section
    } else if (currentSection === 'Profile_1') {
      // const propertyMatch = line.match(/([^=]+)/)
      const [key, value] = line.split('=')

      // if Profile_1 just push the key and value
      if (key && value) {
        keyValue = [key, value]
        keyValueArray.push(keyValue)
        properties[key.trim()] = value.trim()
      //  console.log(properties)
      }
    }
  }

  console.log(keyValueArray)
  console.log(properties, 'PROPS')

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

  // for (let i = prevPropsArray.length; i < modPropsArray.length; i++) {
  //   changes.push(`Added ${propertyName}: '${modPropsArray[i]}'`)
  // }

  // for (let i = modPropsArray.length; i < prevPropsArray.length; i++) {
  //   changes.push(`Removed ${propertyName}: '${prevPropsArray[i]}'`)
  // }

  return changes
}


const compareActions = { compareArr, compareArrByProperty}

module.exports = compareActions