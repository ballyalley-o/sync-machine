/**
 * log line indeces
 */
const LOG = {
  production: {
    dateTime: 0,
    frameSet: 1,
    componentName: 2,
    componentLength: 3,
    flange: 4,
    web: 5,
    unit: 6,
    modClassifier: 7,
  },
  erp: {
    dateTime: 0,
    operator: 1,
    coilBatchName: 2,
    coilWidth: 3,
    coilThickness: 4,
    coilLength: 5,
    frameSet: 6,
    componentLabel: 7,
    web: 8,
    flange: 9,
    profileShape: 10,
    componentLength: 11,
    waste: 12,
    time: 13,
    componentWeight: 14,
  },
}

module.exports = LOG
