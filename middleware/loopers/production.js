// // TODO: instead of just returning just the index, return all of the cases
// const productionLooper = (lines, index) => {
//   let el

//   switch (index) {
//     case 'date':
//       el = 0
//       break
//     case 'frameSet':
//       el = 1
//       break
//     case 'componentName':
//       el = 2
//       break
//     case 'componentLength':
//       el = 3
//       break
//     case 'flange':
//       el = 4
//       break
//     case 'web':
//       el = 5
//       break
//     case 'unit':
//       el = 6
//       break
//     case 'modClassifier':
//       el = 7
//       break

//     default:
//       el = null
//   }

//   let total = 0

//   for (let i = 0; i < lines.length; i++) {
//     const splitEl = lines[i].includes(',')

//     if (splitEl) {
//       const lineArr = lines[i].split(',')
//       let parsedEl

//       // checking if the elements are string then just return it
//       if (typeof el === 'string') {
//         return lineArr[el]
//       } else {
//         // for num types
//         parsedEl = parseFloat(lineArr[el])
//         return parsedEl.toFixed(2)
//       }
//     }
//   }
// }

// module.exports = productionLooper

// TODO: instead of just returning just the index, return all of the cases
const productionLooper = (lines, index) => {
  const caseIndices = {
    date: 0,
    frameSet: 1,
    componentName: 2,
    componentLength: 3,
    flange: 4,
    web: 5,
    unit: 6,
    modClassifier: 7,
  }

  const el = caseIndices[index]
  let result = {}

  for (let i = 0; i < lines.length; i++) {
    const splitEl = lines[i].includes(',')

    if (splitEl) {
      const lineArr = lines[i].split(',')
      let parsedEl

      // checking if the elements are string then just return it
      if (typeof el === 'string') {
        result[index] = lineArr[el]
      } else {
        // for num types
        parsedEl = lineArr[el]
        result[index] = parsedEl
      }
    }
  }

  return result
}

module.exports = productionLooper
