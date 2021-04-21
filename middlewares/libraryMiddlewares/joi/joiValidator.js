const CustomError = require('../../../helpers/error/CustomError')

const joiValidate = (schema) => {
    return async (req, res, next) => {
        try {
            const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true })
            if (error == null) return next()
            const message = error.details.map(i => i.message).join('<br>')
            return next(new CustomError(message, 400))
        } catch (err) {
            return next(err)
        }

    }
}
module.exports = joiValidate
