const searchQueryHelper = (searchKey, query, model, req) => {
    let search = req.query.search
    let searchQueryObje = {}
    if (search != '' && search !== undefined) {
        console.log('geldi')
        let searchObject = {}
        let searchCount
        search = String(search).replace(/[^\w\s]/gi, '')
        const regexSearch = new RegExp(search, 'i')
        searchObject[searchKey] = regexSearch

        searchQueryObje['newSearchQuery'] = query.where(searchObject)
        searchQueryObje['searchCountQuery'] = model.find({ isUserBlock: 'false' }).where(searchObject).countDocuments()

        return searchQueryObje

    }

    searchQueryObje['newSearchQuery'] = query
    return searchQueryObje
}

const paginationQueryHelper = (count, query, req) => {


    const limit = parseInt(req.query.limit) || 10
    const startIndex = parseInt(req.query.startIndex) || 0

    let isEndIndex = true

    const endIndex = startIndex + limit

    if (endIndex < count) {
        isEndIndex = false
    }

    query = query.skip(startIndex).limit(limit)


    return { newPaginationQuery: query, isEndIndex }

}

const populateQueryHelper = (query, populateObje) => {
    let newPopulateQuery
    return newPopulateQuery = query.populate(populateObje)
}

const sortQueryHelper = (query, req, sortObje) => {
    let { sortBy } = req.query
    let newSortQuery

    switch (sortBy) {
        case 'mostLike':
            return newSortQuery = query.sort(sortObje.like)
        case 'mostComment':
            return newSortQuery = query.sort(sortObje.comment)
        default:
            return newSortQuery = query.sort('-createdAt')

    }
}

const populatePaginationQueryHelper = (count, req) => {
    const limit = parseInt(req.query.limit) || 10
    const startIndex = parseInt(req.query.startIndex) || 0

    let isEndIndex = true
    const endIndex = startIndex + limit

    if (endIndex < count) {
        isEndIndex = false
    }


    return { isEndIndex, startIndex, limit }
}

const populateSortQueryHelper = (req) => {
    let { sortBy } = req.query

    switch (sortBy) {
        case 'mostLike':
            return sortBy = '-likeCount -createdAt'
        case 'mostComment':
            return sortBy = '-commentCount -createdAt'
        default:
            return sortBy = '-createdAt'
    }
}


module.exports = {
    searchQueryHelper,
    populateQueryHelper,
    paginationQueryHelper,
    sortQueryHelper,
    populateSortQueryHelper,
    populatePaginationQueryHelper,
}
