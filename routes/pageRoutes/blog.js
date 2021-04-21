const express = require('express')
const blogController = require('../../controllers/blog.js')
const authorization = require('../../middlewares/authorization/authorization')
const queryCheck = require('../../middlewares/database/queryCheck')

const router = express.Router()


router.get('/add',
    authorization.isLogin,
    blogController.addBlogPage)

router.get('/:slugTitle/details',
    queryCheck.blogSlugCheck,
    blogController.detailsBlogPage,
)

router.get('/:slugTitle/edit',
    authorization.isLogin,
    queryCheck.blogSlugCheck,
    authorization.isOwnerTheBlog,
    blogController.updateBlogPage,
)


module.exports = router
