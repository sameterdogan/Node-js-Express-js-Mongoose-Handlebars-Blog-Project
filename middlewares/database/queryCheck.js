const BlogModel = require('../../models/blog')
const CommentModel = require('../../models/comment')
const UserModel = require('../../models/user')
const CustomError = require('../../helpers/error/CustomError')

const userEmailCheck = async (req, res, next) => {

    try {
        const user = await UserModel.findOne({ email: req.body.email })

        if (user === null) {
            return res.status(400).json({
                success: false,
                error: 'Bu E-postaya tanımlı hesap  bulunamadı.',
            })
        }
        req.emailCheckedUser = user
        return next()
    } catch (err) {
        return next(err)
    }

}

const userSlugCheck = async (req, res, next) => {
    try {
        console.log('slug check edildi')
        const user = await UserModel.findOne({ slugName: req.params.slugName })
        console.log(user)
        if (user === null) {
            return res.status(404).render('pages/error/404', {
                layout: false,
            })
        }
        req.slugCheckedUser = user
        next()

    } catch (err) {
        return res.status(500).render('pages/error/500')
    }

}
const apiUserIdCheck = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.params.userId)
        if (user === null || undefined)
            return next(new CustomError('Bu kullanıcı silinmiş veya kaldırılmış olabilir !', 404))
        req.idCheckedUser = user
        next()
    } catch (err) {
        console.log(err)
        next(err)
    }


}

const blogSlugCheck = async (req, res, next) => {

    try {
        const blog = await BlogModel.findOne({ slugTitle: req.params.slugTitle })
        if (blog === null) {

            return res.status(404).render('pages/error/404', {
                layout: false,
            })
        }
        req.blog = blog
        next()
    } catch (err) {
        return res.status(500).render('pages/error/500')
    }


}
const apiBlogIdCheck = async (req, res, next) => {
    try {
        const blog = await BlogModel.findById(req.params.blogId)

        if (blog === null)
            return next(new CustomError('Yazı silinmiş veya kaldırılmış olabilir !', 404))
        req.blog = blog
        next()
    } catch (err) {
        next(err)
    }
}

const apiCommentIdCheck = async (req, res, next) => {

    try {
        console.log(req.params.commentId)
        const comment = await CommentModel.findById(req.params.commentId)
        if (comment == null) {
            return next(new CustomError('yorum daha önce silinmiş veya kaldırılmış.', 404))
        }
        req.comment = comment
        next()
    } catch (err) {
        next(err)
    }


}


module.exports = {
    blogSlugCheck,
    apiBlogIdCheck,
    apiCommentIdCheck,
    userSlugCheck,
    apiUserIdCheck,
    userEmailCheck,
}
