const os = require('os')

exports.USER = process.env.USERPROFILE
exports.NODE = process.versions.node
exports.HOST = os.hostname()
