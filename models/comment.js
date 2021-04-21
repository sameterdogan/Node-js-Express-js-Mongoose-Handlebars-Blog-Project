const mongoose = require('mongoose')
const BlogModel = require('./blog')
const CustomError = require('../helpers/error/CustomError')

const Schema = mongoose.Schema


const CommentSchema = new Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isUserBlock: {
        type: Boolean,
        default: false,
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
    },
    content: {
        type: String,
        required: [true, 'içerik kısmı boş geçilemez'],
        trim: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    likeCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

})

//eklenen yorumu bloğun comments dizisine ekliyoruz.
CommentSchema.pre('save', async function(next) {

    try {
        if (!this.isModified('user')) return next()

        await BlogModel.updateOne({ '_id': this.blog }, { $push: { 'comments': this._id }, $inc: { commentCount: 1 } })
    } catch (err) {
        return next(err)
    }


})

//silinen yorumu bloğun comments dizisinden siliyoruz ve commentsCountu comment dizisinin lengthine eşitliyoruz.
CommentSchema.pre('remove', async function(next) {
    try {
        console.log('geldii')
        await BlogModel.updateOne({ '_id': this.blog }, {
            $pull: { 'comments': this._id },
            $inc: { commentCount: -1 },
        })
    } catch (err) {
        return next(err)
    }
})


CommentSchema.pre('deleteMany', { document: false, query: true }, async function(next) {
    try {
        const docs = await this.model.find(this.getFilter())
        const comments = docs.map((item) => item._id)
        await BlogModel.updateMany({ $pull: { comments: { $in: comments } } })
    } catch (err) {
        return next(err)
    }


})


const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment
