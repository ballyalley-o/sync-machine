

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

module.exports = compareArr