const {
    populateSortQueryHelper,
    populatePaginationQueryHelper,
    populateQueryHelper,
} = require('../../helpers/queryMiddleware/queryMiddlewareHelper')
const CustomError = require('../../helpers/error/CustomError')
const userBlogsAndSavedBlogsQueryMiddleware = (model, populateObjectPath) => {

    return async (req, res, next) => {

        try {
            let search = req.query.search || ''
            search = new RegExp(String(search).replace(/[^\w\s]/gi, ''), 'i')
            const { userId } = req.params
            const blogCount = (await model.findById(userId).populate({
                path: `${populateObjectPath}`,
                select: 'blogTitle',
                options: { where: { blogTitle: search, isUserBlock: false } },
            }))[populateObjectPath].length

            if (blogCount === undefined) throw new Error('Böyle bir kullanıcı bulunumadı.')

            let query = model.findById(userId)

            const { limit, startIndex, isEndIndex } = populatePaginationQueryHelper(blogCount, req)

            const sortBy = populateSortQueryHelper(req)

            const populateObje = {
                path: `${populateObjectPath}`,
                select: 'blogImage blogTitle blogSummary commentCount likeCount slugTitle user readingTime',
                options: {
                    sort: sortBy,
                    skip: startIndex,
                    limit: limit,
                    where: { blogTitle: search, isUserBlock: false },
                },
                populate: { path: 'user', select: 'name profileImg slugName' },

            }

            query = populateQueryHelper(query, populateObje)

            req.userBlogsQuery = query
            req.isEndIndex = isEndIndex

            next()
        } catch (err) {
            console.log(err)
            return next(new CustomError('Sistemsel bir sorunla karşılaştık en kısa sürede çözeceğiz'))
        }
    }


}

module.exports = userBlogsAndSavedBlogsQueryMiddleware
