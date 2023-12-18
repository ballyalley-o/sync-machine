require('colors')

const notFound = (req, res, next) => {
    const error = new Error(`[NOT FOUND] = ${req.originalUrl}`.bgRed)
    res.status(404)
    next(error)
}

module.exports = notFound