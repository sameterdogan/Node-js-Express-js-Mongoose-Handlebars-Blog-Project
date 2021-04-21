const express = require('express')
const blogController = require('../../controllers/blog')
const BlogModel = require('../../models/blog')
const authorization = require('../../middlewares/authorization/authorization')
const queryCheck = require('../../middlewares/database/queryCheck')
const multiparty = require('connect-multiparty')
const multiPartyMiddleware = multiparty()
const path = require('path')
const blogQueryMiddleware = require('../../middlewares/query/blogsQueryMiddleware')
const blogImageMulter = require('../../middlewares/libraryMiddlewares/multer/blogImageMulter')
const commentsRouter = require('./comments.js')
const moment = require('moment')
const joiValidator = require('../../middlewares/libraryMiddlewares/joi/joiValidator')
const joiSchema = require('../../helpers/validation/joiSchema')
const router = express.Router()


router.use('/:blogId/comments', commentsRouter)

//admin sayfası için  !!
router.get('/allBlogs',
    authorization.apiIsLogin,
    authorization.apiIsAdmin,
    blogController.getAllBlogs,
)

router.get('/',
    blogQueryMiddleware,
    blogController.getBlogs,
)

router.use(authorization.apiIsLogin)


router.post('/',
    blogImageMulter.single('blogImage'),
    joiValidator(joiSchema.blogSchema),
    blogController.addBlog,
)


router.put('/:blogId',
    queryCheck.apiBlogIdCheck,
    authorization.apiIsOwnerTheBlog,
    blogImageMulter.single('blogImage'),
    joiValidator(joiSchema.blogSchema),
    blogController.updateBlog,
)


router.delete('/:blogId',
    queryCheck.apiBlogIdCheck,
    authorization.apiIsOwnerTheBlog,
    blogController.deleteBlog,
)


router.get('/:blogId/likeOrUndoLike',
    queryCheck.apiBlogIdCheck,
    blogController.likeOrUndoLikeBlog,
)


router.get('/:blogId/saveOrUndoSaveBlog',
    queryCheck.apiBlogIdCheck,
    blogController.saveOrUndoSaveBlog,
)


router.post('/blogContentImageUpload', multiPartyMiddleware, blogController.blogContentImageUpload)


module.exports = router
