module.exports = {
  // handlers
  notFound: require('./not-found'),
  asyncHandler: require('./async-handler'),
  errorHandler: require('./error-handler'),
  // extractors
  extractBySection: require('./extractors/extract'),
  extractBySectionObj: require('./extractors/extract-obj'),
  // loopers
  logger: require('./logger'),
  logLooper: require('./loopers/log'),
  coilLooper: require('./loopers/coil'),
  iniLooper: require('./loopers/ini'),
  analogLooper: require('./loopers/analog'),
  productionLooper: require('./loopers/production'),
  // websocket implementation
  sysLooper: require('./loopers/system'),
  sysLogWs: require('./system-log-ws'),
}
