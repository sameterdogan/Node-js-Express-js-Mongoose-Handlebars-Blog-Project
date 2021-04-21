const mongoose = require('mongoose')
const slugify = require('slugify')
const fs = require('fs')
const path = require('path')
const CusttomError = require('../helpers/error/CustomError')
const uniqId = require('uniqid')
const rootDir = require('app-root-path').path


const Schema = mongoose.Schema

const BlogSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: true,
    },
    isUserBlock: {
        type: Boolean,
        default: false,
    },
    blogImage: {
        type: String,
    },
    blogTitle: {
        type: String,
    },
    readingTime: {
        type: Number,
        default: 10,
    },
    blogSummary: {
        type: String,
    },
    blogContent: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    likeCount: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    commentCount: {
        type: Number,
        default: 0,
    },
    slugTitle: {
        type: String,
    },
})

// blog title sluglama
BlogSchema.pre('save', function(next) {
    if (!this.isModified('blogTitle')) {
        return next()
    }
    const slugTitle = slugify(this.blogTitle, {
        replacement: '-',
        remove: /[*+~.()?'"!:@#]/g,
        lower: true,
    })
    this.slugTitle = uniqId(slugTitle)
    next()
})

//eklenen yazıyı kullanıcının blogs dizisine ekleme
BlogSchema.pre('save', async function(next) {

    try {

        if (!this.isModified('user')) {
            return next()
        }
        await UserModel.updateOne({ _id: this.user }, { $push: { blogs: this._id } })

    } catch (err) {
        return next(err)
    }

})

//silinen yazıyı kullanıcının blogs dizisinden silme
BlogSchema.pre('remove', async function(next) {
    try {
        await UserModel.updateOne({ _id: this.user }, { $pull: { 'blogs': this._id } })
    } catch (err) {
        return next(err)
    }


})

//silinen yazının yorumlarını silme
BlogSchema.pre('remove', async function(next) {
    try {
        const deletedComment = await CommentModel.deleteMany({ blog: this._id })
        next()
    } catch (err) {
        console.log(err)
        return next(err)
    }
})

//toplu silinen yazının yorumlarını silme
BlogSchema.pre('deleteMany', async function(next) {
    try {
        const docs = await this.model.find(this.getFilter())
        const blogIds = docs.map((item) => item._id)
        await CommentModel.deleteMany({ blog: { $in: blogIds } })
        next()
    } catch (err) {
        console.log(err)
        return next(err)
    }

})


//silinen yazının resmini silme
BlogSchema.post('remove', function() {
    fs.unlink(path.join(rootDir, `/assets/image/blogImage/${this.blogImage}`), (err => {
        if (err) console.log(err)
    }))
})


const BlogModel = mongoose.model('Blog', BlogSchema)
module.exports = BlogModel
const UserModel = require('./user')
const CommentModel = require('./comment')
