const express = require('express')
const CommentModel = require('../../models/comment')
const commentController = require('../../controllers/comment')
const CommentsQueryMiddleware = require('../../middlewares/query/commentsQueryMiddleware')
const authorization = require('../../middlewares/authorization/authorization')
const queryCheck = require('../../middlewares/database/queryCheck')
const router = express.Router({ mergeParams: true })


router.get('/',
    CommentsQueryMiddleware,
    commentController.getComments)

router.use(authorization.apiIsLogin)


router.post('/', commentController.addComment)


router.delete('/:commentId',
    queryCheck.apiCommentIdCheck,
    authorization.apiIsOwnerTheComment,
    commentController.deleteComment,
)


router.get('/:commentId/likeOrUndoLike',
    queryCheck.apiCommentIdCheck,
    commentController.likeOrUndoLikeComment,
)

module.exports = router
