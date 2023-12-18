const { RESPONSE, GLOBAL } = require("../constants")

/**
 * Global Error Handler
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode
    let message = err.message
    let errors = err.errors

    const PROD_ENV = 'production'

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404
        message = RESPONSE.error[404]
    }

    if (err.errors) {
        const errorsArr = Object.values(err.errors).map((err) => err.message)
        statusCode = 400
        errors = errorsArr
    }

    res.status(statusCode).json({
        message: message || errors,
        stack: GLOBAL.env === PROD_ENV ? null : err.stack
    })
}


module.exports = errorHandler