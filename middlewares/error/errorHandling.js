const CustomError = require('../../helpers/error/CustomError')


const errorHandling = (err, req, res, next) => {
    console.log(err)

    res.status(err.status || 500).json({
        success: false,
        error: err.status ? err.message : 'Sistemsel bir sorunla karşılaştık.',
    })
}
module.exports = errorHandling
