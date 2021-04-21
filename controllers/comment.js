const CommentModel = require('../models/comment')

const getComments = async (req, res, next) => {
    try {
        const comments = await req.commentsQuery
        res.status(200).json({
            success: true,
            message: 'Yorumlar listelendi',
            data: {
                comments: comments,
                isEndIndex: req.isEndIndex,
            },
        })
    } catch (err) {
        return next(err)
    }


}

const addComment = async (req, res, next) => {
    try {
        req.body.user = req.user.id
        req.body.blog = req.params.blogId

        const comment = await CommentModel.create({ ...req.body })

        res.status(200).json({
            success: true,
            data: { comment },
            message: 'Yorum başarıyla eklendi',
        })
    } catch (err) {
        return next(err)
    }

}

const deleteComment = async (req, res, next) => {

    try {
        const comment = req.comment
        await comment.remove()
        res.status(200).json({
            success: true,
            message: 'Yorum başarıyla silindi',
        })
    } catch (err) {
        return next(err)
    }


}

const likeOrUndoLikeComment = async (req, res, next) => {
    try {
        const userId = req.user.id
        const comment = req.comment
        const index = comment.likes.indexOf(userId)
        let color

        if (index == -1) {
            comment.likes.push(userId)
            comment.likeCount++
            color = 'text-danger'
        } else {
            comment.likes.splice(index, 1)
            comment.likeCount--
            color = 'text-dark'
        }
        await comment.save()
        res.status(200).json({
            success: true,
            data: {
                comment,
                color,
            },
        })
    } catch (err) {
        return next(err)
    }


}

module.exports = {
    addComment,
    getComments,
    deleteComment,
    likeOrUndoLikeComment,
}
