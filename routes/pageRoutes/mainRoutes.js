const express = require('express')
const indexController = require('../../controllers')
const authRouter = require('./auth')
const adminRouter = require('./admin')
const blogRouter = require('./blog')
const userRouter = require('./user')
const authorizationMiddleware = require('../../middlewares/authorization/authorization')
const router = express.Router()

router.get('/', indexController.homePage)
router.use('/admin', authorizationMiddleware.isAdmin, adminRouter)
router.use('/auth', authRouter)
router.use('/blogs', blogRouter)
router.use('/users', userRouter)


module.exports = router
