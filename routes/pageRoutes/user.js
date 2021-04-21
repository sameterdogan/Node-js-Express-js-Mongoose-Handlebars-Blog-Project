const express = require('express')
const authorization = require('../../middlewares/authorization/authorization')
const queryCheck = require('../../middlewares/database/queryCheck')
const userController = require('../../controllers/user')

const router = express.Router()


router.get('/:slugName/profile',
    queryCheck.userSlugCheck,
    authorization.isBlock,
    userController.getProfilePage)

router.use(authorization.isLogin)

router.get('/:slugName/editProfile',
    queryCheck.userSlugCheck,
    authorization.isOwnerTheUser,
    userController.getEditProfilePage,
)


module.exports = router
