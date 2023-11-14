

const sysLooper = (lines, index) => {
  let el

  switch (index) {
    case 'date':
      el = 0
      break
    case 'log':
      el = 1
      break

    default:
      el = null
  }

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
        parsedEl = lineArr[el]
        return parsedEl
      }
    }
  }
}

module.exports = sysLooper
