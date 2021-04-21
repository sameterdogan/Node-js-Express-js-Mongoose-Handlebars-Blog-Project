const express = require('express')
const blog = require('./blog')
const user = require('./user')
const admin = require('./admin')
const category = require('./category')
const auth = require('./auth')
const authorizationMiddleware = require('../../middlewares/authorization/authorization')
const router = express.Router()


router.use('/blogs', blog)
router.use('/users', user)
router.use('/categories', category)
router.use('/auth', auth)
router.use('/admin', authorizationMiddleware.isAdmin, admin)


module.exports = router
