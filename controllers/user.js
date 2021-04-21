const UserModel = require('../models/user')


const getProfilePage = (req, res) => {

    UserModel.findOne({ slugName: req.params.slugName }, { blogs: 0 }, (err, user) => {
            if (err) return res.status(500).render('pages/error/500')
            res.status(200).render('pages/profile', {
                user,
            })
        },
    )
}
const getEditProfilePage = (req, res) => {

    UserModel.findOne({ slugName: req.params.slugName }, { blogs: 0 }, (err, user) => {
            if (err) return res.status(500).render('pages/error/500')
            res.status(200).render('pages/editProfile', {
                user,
            })
        },
    )
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await UserModel.find({}, {
            name: 1,
            email: 1,
            company: 1,
            role: 1,
            blogs: 1,
            slugName: 1,
            block: 1,
        })
        res.status(200).json({
            success: true,
            message: 'Tüm kullanıcılar listelendi',
            data: { users },
        })
    } catch (err) {
        return next(err)
    }


}
const getUserBlogs = async (req, res, next) => {

    try {
        const user = await req.userBlogsQuery

        res.status(200).json({
            success: true,
            message: 'Kullanıcının yazıları listelendi',
            data: {
                blogs: user.blogs,
                isEndIndex: req.isEndIndex,
            },

        })
    } catch (err) {
        return next(err)
    }

}
const getUserSavedBlogs = async (req, res, next) => {
    try {
        const user = await req.userBlogsQuery

        res.status(200).json({
            success: true,
            message: 'Keydedilen yazılar listelendi',
            data: {
                savedBlogs: user.savedBlogs,
                isEndIndex: req.isEndIndex,
            },

        })
    } catch (err) {
        return next(err)
    }


}
const deleteUser = async (req, res, next) => {

    try {
        const user = req.idCheckedUser
        await user.remove()
        res.status(200).json({
            success: true,
            message: 'Kullanıcı silindi.',
        })
    } catch (err) {
        return next(err)
    }


}
const editProfile = async (req, res, next) => {
    try {
        if (req.profileImg !== undefined) req.body.profileImg = req.profileImg

        const user = await UserModel.findByIdAndUpdate(req.params.userId, { ...req.body }, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            succes: true,
            message: 'Bilgiler başarıyla güncellendi.',
            data: { user },
        })

    } catch (err) {
        return next(err)
    }


}


module.exports = {
    getProfilePage,
    getEditProfilePage,
    getAllUsers,
    getUserBlogs,
    getUserSavedBlogs,
    editProfile,
    deleteUser,
}
