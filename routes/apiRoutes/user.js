const express = require('express')
const UserModel = require('../../models/user')
const userController = require('../../controllers/user')
const userBlogsAndSavedBlogsQueryMiddleware = require('../../middlewares/query/userBlogsAndSavedBlogsQueryMiddleware')
const userProfileImageMulter = require('../../middlewares/libraryMiddlewares/multer/userProfileImageMulter')
const authorization = require('../../middlewares/authorization/authorization')
const queryCheck = require('../../middlewares/database/queryCheck')
const joiValidator = require('../../middlewares/libraryMiddlewares/joi/joiValidator')
const joiSchema = require('../../helpers/validation/joiSchema')

const router = express.Router()

router.get('/allUsers',
    authorization.isLogin,
    authorization.isAdmin,
    userController.getAllUsers)

router.get('/:userId/blogs',
    userBlogsAndSavedBlogsQueryMiddleware(UserModel, 'blogs'),
    userController.getUserBlogs)


router.get('/:userId/savedBlogs',
    userBlogsAndSavedBlogsQueryMiddleware(UserModel, 'savedBlogs'),
    userController.getUserSavedBlogs)


router.use(authorization.apiIsLogin)

router.put('/:userId/editProfile',
    queryCheck.apiUserIdCheck,
    authorization.apiIsOwnerTheUser,
    userProfileImageMulter.single('profileImg'),
    joiValidator(joiSchema.userSchema),
    userController.editProfile)

router.use(authorization.apiIsAdmin)

router.delete('/:userId',
    queryCheck.apiUserIdCheck,
    authorization.isAdmin,
    userController.deleteUser,
)


module.exports = router
