const express = require('express')
const authController = require('../../controllers/auth')


const router = express.Router()

router.get('/register', authController.registerPage)

router.get('/login', authController.loginPage)

router.get('/forgot_password', authController.forgotPasswordPage)

router.get('/reset_password', authController.resetPasswordPage)

router.post('/login', authController.login)

router.get('/logout', authController.logout)


//e posta onaylma sistemi şu an devre dışı
/*
router.post("/check_email_send_code",
    queryCheck.userEmailCheck,
    authController.checkEmailSendCode
);
router.post("/check_email",authController.checkEmail);


router.get("/check_email",authController.checkEmailPage);

router.get("/check_email_send_code",authController.checkEmailSendCodePage);
*/


module.exports = router

