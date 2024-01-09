const { LOG } = require('../../constants')

const productionLooper = (lines, index) => {
  const el = LOG.production[index]
  let result = {}

  for (let i = 0; i < lines.length; i++) {
    const splitEl = lines[i].includes(',')

    if (splitEl) {
      const lineArr = lines[i].split(',')

      let parsedEl

      // checking if the elements are string then just return it
      if (typeof el === 'string') {
        result[index] = lineArr[el].trim()
      } else {
        // for num types
        parsedEl = lineArr[el]
        result[index] = parsedEl.trim()
      }
    }
  }

  return result
}

module.exports = productionLooper
