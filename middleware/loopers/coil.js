// const logger = require('./logger')

const e = require("express")

const coilLooper = (lines, index) => {
  let el

  switch (index) {
    case 'date':
      el = 0
      break
    case 'coilBatch':
      el = 1
      break
    case 'length':
      el = 2
      break
    case 'thickness':
      el = 4
      break
    case 'width':
      el = 6
      break
    case 'weight':
      el = 7
      break
    case 'density':
      el = 8
      break
    case 'operator':
      el = 9
      break

    default:
      el = null
  }

  let total = 0

  for (let i = 0; i < lines.length; i++) {
    const splitEl = lines[i].includes(',')

    if (splitEl) {
      const lineArr = lines[i].split(',')
      let parsedEl

      // checking if the elements are string then just return it
      if (el === 1 || el === 9) {

        return lineArr[el]
      } else {
        // for num types
        parsedEl = parseFloat(lineArr[el])
        return parsedEl
      }
      // for calculating total
      // console.log(lineArr[4], 'COIL PARSED EL')
      // if (!isNaN(parsedEl)) {
      //   total += parsedEl
      // }
    }
  }
}

module.exports = coilLooper
