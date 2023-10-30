// // Sample data (old and updated INI data as arrays of strings)
const oldIniData = [
  'Parameter1=10',
  'Parameter2=20',
  'Parameter3=30',
  'Parameter4=40',
]

const updatedIniData = [
  'Parameter1=10',
  'Parameter2=25', // Changed value
  'Parameter3=30',
  'Parameter5=50', // Added parameter
]

// Function to parse INI data into objects
const parseIniData = (data) => {
  const iniObject = {}
  for (const line of data) {
    const [param, value] = line.split('=')
    iniObject[param] = value
  }
  return iniObject
}


const updatedParams = (oldIni, updatedIni) => {
  // Parse the old and updated INI data
  //   const oldIniObject = parseIniData(oldIniData)
  //   const updatedIniObject = parseIniData(updatedIniData)
  const oldIniObject = oldIni
  const updatedIniObject = updatedIni

  // Compare the objects to identify changes
  const changedParams = []

  for (const param in oldIniObject) {
    if (updatedIniObject[param] !== undefined) {
      if (oldIniObject[param] !== updatedIniObject[param]) {
        changedParams.push({
          parameter: param,
          oldValue: oldIniObject[param],
          updatedValue: updatedIniObject[param],
        })
      }
    } else {
      // Parameter missing in the updated data
      changedParams.push({
        parameter: param,
        oldValue: oldIniObject[param],
        updatedValue: 'Parameter Removed',
      })
    }
  }

  for (const param in updatedIniObject) {
    if (oldIniObject[param] === undefined) {
      // New parameter in the updated data
      changedParams.push({
        parameter: param,
        oldValue: 'Parameter Added',
        updatedValue: updatedIniObject[param],
      })
    }
  }

  return changedParams
}


module.exports = updatedParams