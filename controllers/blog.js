const BlogModel = require('../models/blog')
const UserModel = require('../models/user')
const readingTimeCalculate = require('../helpers/database/readingTimeCalculate.js')
const path = require('path')
const fs = require('fs')
const uniqId = require('uniqid')
const moment = require('moment')
const CustomError = require('../helpers/error/CustomError')
const rootDir = require('app-root-path').path
moment.locale('tr')


const addBlogPage = (req, res, next) => {
    return res.render('pages/addBlog')
}


const detailsBlogPage = (req, res, next) => {

    BlogModel.findOne({ slugTitle: req.params.slugTitle })
        .populate([{ path: 'user' }, { path: 'category' }])
        .exec((err, blog) => {
            if (err) return res.status(500).render('pages/error/500')
            const parseDate = moment(blog.createdAt).format('ll')
            blog.parseDate = parseDate
            res.render('pages/blogDetails', {
                blog,
            })
        })
}


const updateBlogPage = (req, res, next) => {

    BlogModel.findOne({ slugTitle: req.params.slugTitle }, (err, blog) => {
        if (err) return res.status(500).render('pages/error/500')
        return res.render('pages/blogUpdate', {
            blog: blog,
        })
    })
}


const getBlogs = async (req, res, next) => {
    try {
        const blogs = await req.blogQuery
        res.status(200).json({
            success: true,
            message: 'Yazılar listelendi.',
            data: {
                blogs,
                isEndIndex: req.isEndIndex,
            },
        })
    } catch (err) {
        return next(err)
    }

}


const getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogModel.find({}, { blogTitle: 1, user: 1, category: 1, slugTitle: 1, createdAt: 1 })
            .populate([{ path: 'user', select: 'name slugName' }, { path: 'category' }])
        return res.status(200).json({
            success: true,
            message: 'Tüm yazılar listelendi',
            data: { blogs },
        })
    } catch (err) {
        next(err)
    }

}


const addBlog = async (req, res, next) => {
    try {
        console.log(req.body)
        req.body.user = req.user.id
        req.body.blogImage = req.blogTitleImage
        req.body.readingTime = readingTimeCalculate(req.body.blogContent)
        await BlogModel.create({ ...req.body })
        res.status(200).json({
            success: true,
            message: 'blog başarılı bir şekilde eklendi.Ana sayfaya yönlendiriliyorsunuz',
            toUrl: '/',
        })
    } catch (err) {
        return next(err)
    }

}


const deleteBlog = async (req, res, next) => {

    try {
        const blog = req.blog
        await blog.remove()
        res.status(200).json({
            success: true,
            message: 'yazı silindi.',
        })
    } catch (err) {
        return next(err)
    }


}


const updateBlog = async (req, res, next) => {
    try {
        if (req.blogTitleImage != undefined) req.body.blogImage = req.blogTitleImage
        await BlogModel.findByIdAndUpdate(req.params.blogId, { ...req.body }, { runValidators: true })
        res.status(200).json({
            success: true,
            message: 'Yazı başarılı bir şekilde güncellendi.Ana sayfaya yönlendiriliyorsunuz.',
            toUrl: '/',
        })
    } catch (err) {
        return next(err)
    }

}


const likeOrUndoLikeBlog = async (req, res, next) => {
    try {
        const userId = req.user._id
        const blog = req.blog
        const index = blog.likes.indexOf(userId)
        let message = ''
        let color = ''
        if (index == -1) {
            blog.likes.push(userId)
            blog.likeCount = blog.likes.length
            message = 'Beğenme işlemi başarılı.'
            color = 'text-danger'
            await blog.save()
        } else {
            blog.likes.splice(index, 1)
            blog.likeCount = blog.likes.length
            message = 'beğeni geri alma işlemi başarılı.'
            color = 'text-dark'
            await blog.save()
        }

        res.status(200).json({
            success: true,
            message: message,
            data: {
                blog,
                color: color,
            },
        })

    } catch (err) {
        return next(err)
    }

}


const saveOrUndoSaveBlog = async (req, res, next) => {
    try {
        const { blogId } = req.params
        const user = await UserModel.findById(req.user.id, { savedBlogs: 1 })
        const savedBlogs = user.savedBlogs
        const index = savedBlogs.indexOf(blogId)
        if (index == -1) {
            savedBlogs.push(blogId)
            await user.save()
            return res.status(200).json({
                success: true,
                icon: 'fas fa-bookmark',
                message: 'Yazı kaydedilenler listesine eklendi.',
            })
        }
        savedBlogs.splice(index, 1)
        await user.save()
        res.status(200).json({
            sucess: true,
            icon: 'far fa-bookmark',
            message: 'Yazı kaydedilenler listesinden kaldırıldı.',
        })
    } catch (err) {
        return next(err)
    }


}


const blogContentImageUpload = (req, res, next) => {
    let tempFile = req.files.upload
    let tempFilePath = tempFile.path
    let uniq = uniqId()
    const targetPathUrl = path.join(rootDir, `/assets/image/blogContentImage/${req.user.id}${uniq}${tempFile.name}`)

    if (path.extname(tempFile.originalFilename).toLocaleLowerCase() === 'png' || 'gif') {
        console.log(path.extname(tempFile.originalFilename).toLocaleLowerCase())
        fs.rename(tempFilePath, targetPathUrl, (err) => {
            if (err) return next(new CustomError('Resim uzantısı png,jpg,gif veya jpeg olmalıdır.', 400))
            res.status(200).json({
                uploaded: true,
                url: `/assets/image/blogContentImage/${req.user.id}${uniq}${tempFile.originalFilename}`,
            })


        })
    }
}

module.exports = {
    addBlogPage,
    updateBlogPage,
    detailsBlogPage,
    getBlogs,
    getAllBlogs,
    addBlog,
    updateBlog,
    likeOrUndoLikeBlog,
    saveOrUndoSaveBlog,
    deleteBlog,
    blogContentImageUpload,
}
