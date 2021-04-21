const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin')


router.get('/', adminController.adminPage)

router.get('/category', adminController.categoriesPage)

router.get('/user', adminController.usersPage)


module.exports = router
