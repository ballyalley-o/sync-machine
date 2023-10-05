


const logLooper = (lines, index) => {
    switch (index) {
      case index === 'date':
        index = 0
        break
      case index === 'operator':
        index = 1
        break
      case index === 'coilBatch':
        index = 2
        break
      case index === 'width':
        index = 3
        break
      case index === 'thickness':
        index = 4
        break
      case index === 'coilLength':
        index = 5
        break
      case index === 'frameset':
        index = 6
        break
      case index === 'label':
        index = 7
        break
      case index === 'web':
        index = 8
        break
      case index === 'flange':
        index = 9
        break
      case index === 'profile':
        index = 10
        break
      case index === 'length':
        index = 11
        break
      case index === 'waste':
        index = 12
        break
      case index === 'time':
        index = 13
        break
      case index === 'weight':
        index = 14
        break

        default:
        index = null
    }

    let total = 0
    let el = 0

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(',')) {
        const lineArr = lines[i].split(',')
        const parsedEl = parseFloat(lineArr[index])

        if (!isNaN(parsedEl)) {
          el = parsedEl
          total += el
        }
      }

      return {
        total, el
      }
    }
}

module.exports = logLooper