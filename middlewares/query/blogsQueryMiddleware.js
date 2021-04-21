const BlogModel = require('../../models/blog')
const CustomError = require('../../helpers/error/CustomError')
const {
    searchQueryHelper,
    paginationQueryHelper,
    sortQueryHelper,
    populateQueryHelper,
} = require('../../helpers/queryMiddleware/queryMiddlewareHelper')


const blogsQueryMiddleware = async (req, res, next) => {
    try {
        let query = BlogModel.find({ isUserBlock: 'false' }, { blogContent: 0, comments: 0, likes: 0 })
        let searchCountQuery, defaultCount

        const searchQueryObject = searchQueryHelper('blogTitle', query, BlogModel, req)
        query = searchQueryObject.newSearchQuery

        searchQueryObject.searchCountQuery ?
            searchCountQuery = await searchQueryObject.searchCountQuery :
            defaultCount = await BlogModel.find({ isUserBlock: 'false' }).countDocuments()

        //pagination işlemi
        const { newPaginationQuery, isEndIndex } = paginationQueryHelper(searchCountQuery || defaultCount, query, req)
        query = newPaginationQuery

        const populateObje = [{ path: 'user', select: 'profileImg name slugName block' }, { path: 'category' }]
        //populate işlemi
        if (populateObje) query = populateQueryHelper(query, populateObje)


        //sort işlemi
        query = sortQueryHelper(query, req, {
            like: '-likeCount -commentCount -createdAt',
            comment: '-commentCount -likeCount -createdAt',
        })

        req.blogQuery = query
        req.isEndIndex = isEndIndex
        next()

    } catch (err) {
        console.log(err)
        return next(new CustomError('Sistemsel bir sorunla karşılaştık en kısa sürede çözeceğiz'))
    }

}

module.exports = blogsQueryMiddleware
