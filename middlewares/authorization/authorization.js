const CustomError = require('../../helpers/error/CustomError')

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role == 'Admin') {
        next()
    } else {
        res.status(403).render('pages/error/403', {
            layout: false,
            message: 'Bu işleme yetkin yok !',
        })
    }
}
const apiIsAdmin = (req, res, next) => {
    if (req.user && req.user.role == 'Admin') {
        next()
    } else {
        return next(new CustomError('Bu işleme yetkin yok !', 403))
    }
}

const isBlock = (req, res, next) => {
    const user = req.slugCheckedUser
    if (user.block === true) {
        return res.status(403).render('pages/error/403', {
            layout: false,
        })
    }
    next()
}

const isLogin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).render('pages/auth/login', {
            message: 'Önce giriş yapmalısın.',
        })
    }
    next()
}
const apiIsLogin = (req, res, next) => {
    if (!req.user)
        return next(new CustomError('Önce giriş yapmalısın.', 401))

    next()
}

const isOwnerTheBlog = (req, res, next) => {
    const blog = req.blog
    const userId = req.user._id
    if (blog.user.toString() != userId) {
        return res.status(403).render('pages/error/403', {
            layout: false,
        })
    }

    next()
}
const apiIsOwnerTheBlog = (req, res, next) => {
    const blog = req.blog
    const userId = req.user._id
    const userRole = req.user.role
    if (blog.user.toString() == userId || userRole == 'Admin') {
        next()
    } else {
        return next(new CustomError('Bu işlemi sadece yazar yapabilir.', 403))
    }
}

const isOwnerTheUser = (req, res, next) => {
    if (req.params.slugName != req.user.slugName) {
        return res.status(403).render('pages/error/403', {
            layout: false,
        })
    }
    next()
}
const apiIsOwnerTheUser = (req, res, next) => {
    if (req.params.userId != req.user._id)
        return next(new CustomError('Bu işlemi sadece hesabın sahibi gerçekleştirebilir.', 403))

    next()
}

const apiIsOwnerTheComment = (req, res, next) => {
    const loginUserId = req.user._id
    const comment = req.comment
    if (comment.user.toString() != loginUserId) {
        return next(new CustomError('Bu işlemi sadece yorumun sahibi gerçekleştirebilir.'), 403)
    }
    next()

}


module.exports = {
    isAdmin,
    apiIsAdmin,
    isLogin,
    apiIsLogin,
    isOwnerTheBlog,
    apiIsOwnerTheBlog,
    isBlock,
    isOwnerTheUser,
    apiIsOwnerTheUser,
    apiIsOwnerTheComment,

}

