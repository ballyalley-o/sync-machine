// const logger = require('./logger')


const logLooper = (lines, index) => {
    let el;

    switch (index) {
      case 'date':
        el = 0
        break
      case 'operator':
        el = 1
        break
      case 'coilBatch':
        el = 2
        break
      case 'width':
        el = 3
        break
      case 'thickness':
        el = 4
        break
      case 'coilLength':
        el = 5
        break
      case 'frameset':
        el = 6
        break
      case 'label':
        el = 7
        break
      case 'web':
        el = 8
        break
      case  'flange':
        el = 9
        break
      case 'profile':
        el = 10
        break
      case 'length':
        el = 11
        console.log(er, 'I\'M CALLED')
        break
      case 'waste':
        el = 12
        break
      case 'time':
        el = 13
        break
      case 'weight':
        el = 14
        break

        default:
        el = null
    }

    let total = 0

    for (let i = 0; i < lines.length; i++) {
        const splitEl = lines[i].includes(',')

      if (splitEl) {
        const lineArr = lines[i].split(',')
        const parsedEl = parseFloat(lineArr[el])

        if (!isNaN(parsedEl)) {
          total += parsedEl
        }
      }
    }
  return total
}

module.exports = logLooper