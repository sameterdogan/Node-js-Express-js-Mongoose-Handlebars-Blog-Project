const express = require('express')
const authController = require('../../controllers/auth')
const queryCheck = require('../../middlewares/database/queryCheck')
const joiValidator = require('../../middlewares/libraryMiddlewares/joi/joiValidator')
const joiSchema = require('../../helpers/validation/joiSchema')


const router = express.Router()


router.post('/register',
    joiValidator(joiSchema.registerSchema, 'email'),
    authController.register,
)

router.post('/forgot_password',
    joiValidator(joiSchema.emailSchema),
    queryCheck.userEmailCheck,
    authController.forgotPassword,
)

router.post('/reset_password',
    joiValidator(joiSchema.passwordSchema),
    authController.resetPassword)


module.exports = router
