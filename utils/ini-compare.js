
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

  if (!Array.isArray(prevArr) || !Array.isArray(modArr)) {
    // Handle non-array inputs
    return changes
  }

  const properties = ['TargetWindow', 'Time']

  for (const propertyName of properties) {
    const prevPropertyValues = prevArr.map((item) => item[propertyName])
    const modPropertyValues = modArr.map((item) => item[propertyName])

    prevPropertyValues.forEach((prevValue, index) => {
      if (modPropertyValues[index] !== prevValue) {
        changes.push(
          `${propertyName}: '${prevValue}' -> '${modPropertyValues[index]}'`
        )
      }
    })

    for (let i = prevPropertyValues.length; i < modPropertyValues.length; i++) {
      changes.push(`Added ${propertyName}: '${modPropertyValues[i]}'`)
    }

    for (let i = modPropertyValues.length; i < prevPropertyValues.length; i++) {
      changes.push(`Removed ${propertyName}: '${prevPropertyValues[i]}'`)
    }
  }

  return changes
}


const compareActions = { compareArr, compareArrByProperty}

module.exports = compareActions