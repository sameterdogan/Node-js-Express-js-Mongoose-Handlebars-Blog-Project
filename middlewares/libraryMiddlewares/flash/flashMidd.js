const flashMiddleware = (req, res, next) => {

    //auth message
    res.locals.registerSuccess = req.flash('registerSuccess')

    res.locals.loginError = req.flash('error')

    res.locals.resetPasswordSuccess = req.flash('resetPasswordSuccess')


    res.locals.loginUser = req.user


    next()


}

module.exports = flashMiddleware
