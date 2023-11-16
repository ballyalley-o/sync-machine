const RESPONSE = {
  iniSimulation: 'Ready for simulation.',
  noChanges: 'No changes found',
  success: {
    200: 'OK: Successful Request',
    normalized: (word, result) => `NORMALIZED ${word} to ${result}`

  },
  error: {
    404: 'RESOURCE REQUESTED NOT FOUND',
    failedNormalize: (word) => `FAILED TO NORMALIZE ${word}`
  }
}

module.exports = RESPONSE