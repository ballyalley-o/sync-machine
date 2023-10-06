// old controller logic for looping
// meters
//  let mmSum = 0

//  for (let i = 0; i < lines.length; i++) {
//    if (lines[i].includes(',')) {
//      const lineArr = lines[i].split(',')
//      const mmEl = parseFloat(lineArr[11])
//      if (!isNaN(mmEl)) {
//        mmSum += mmEl
//      }
//    }
//  }

// // seconds
// let secsTotal = 0

// for (let i = 0; i < lines.length; i++) {
// const lineArr = lines[i].split(',')
// const timeEl = parseFloat(lineArr[13])

// if (!isNaN(timeEl)) {
//     secsTotal += timeEl
// }
// }


// // waste
// let wasteTotal = 0

// for (let i = 0; i < lines.length; i++) {
// const lineArr = lines[i].split(',')
// const wasteEl = parseFloat(lineArr[12])

// if (!isNaN(wasteEl)) {
//     wasteTotal += wasteEl
// }
// }