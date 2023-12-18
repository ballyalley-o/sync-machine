const mongoose = require('mongoose')
const GLOBAL = require('../config/global')
const { logger } = require('../middleware')

const connectDb = async (isConnected) => {
    try {
        const dbConnect = await mongoose.connect(String(GLOBAL.db_uri))
        logger.db(GLOBAL.db_host, dbConnect.connection.name, isConnected)
    } catch (error) {
        logger.error(error.message)
        process.exit()
    }
}


module.exports = connectDb