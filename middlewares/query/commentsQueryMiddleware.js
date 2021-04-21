const {
    sortQueryHelper,
    paginationQueryHelper,
    populateQueryHelper,
} = require('../../helpers/queryMiddleware/queryMiddlewareHelper.js')
const CommentModel = require('../../models/comment')


const commentsQueryMiddleware = async (req, res, next) => {
    try {
        let query = CommentModel.find({ blog: req.params.blogId, isUserBlock: 'false' })

        let commentCount = await CommentModel.find({ blog: req.params.blogId, isUserBlock: 'false' }).countDocuments()
        //pagination işlemi
        const { newPaginationQuery, isEndIndex } = paginationQueryHelper(commentCount, query, req)
        query = newPaginationQuery

        //sort işlemi
        query = sortQueryHelper(query, req, {
            like: '-likeCount -createdAt',
        })
        //populate işlemi
        const populateObje = {
            path: 'user',
            select: 'profileImg name slugName',
        }

        //populate etme
        query = populateQueryHelper(query, populateObje)

        req.commentsQuery = query
        req.isEndIndex = isEndIndex
        next()

    } catch (err) {
        return next(new CustomError('Sistemsel bir sorunla karşılaştık en kısa sürede çözeceğiz'))
    }

}


module.exports = commentsQueryMiddleware
