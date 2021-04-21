const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const slugify = require('slugify')
const uniqId = require('uniqid')
const crypto = require('crypto')
const rootDir = require('app-root-path').path
const path = require('path')
const fs = require('fs')
const CustomError= require("../helpers/error/CustomError")


const Schema = mongoose.Schema

const UserSchema = new Schema({

    name: {
        type: String,
        set: function(value) {
            const fullNameArray = value.split(' ')
            value = ''
            fullNameArray.forEach(name => {
                value += name.charAt(0).toUpperCase() + name.slice(1) + ' '
            })
            return value
        },
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
    }],
    savedBlogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
    }],
    role: {
        type: String,
        default: 'Yazar',
        enum: ['Yazar', 'Admin'],
    },
    email: {
        type: String,
    },
    block: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        trim: true,
        select: false,

    },
    profileImg: {
        type: String,
        default: 'default.png',
    },
    slugName: {
        type: String,
    },
    place: {
        type: String,
        trim: true,
    },
    webSite: {
        type: String,
        trim: true,
    },
    linkedIn: {
        type: String,
        trim: true,

    },
    instagram: {
        type: String,
        trim: true,

    },
    company: { type: String, trim: true },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    forgotPasswordToken: {
        type: String,
    },
    forgotPasswordTokenExpire: {
        type: Date,
    },
    //email onaylama sistemi şu an devre dışı
    /* checkEmail:{
         type:Boolean,
         default:false
     },
     checkEmailCode:{
         type:String,
     },
     checkEmailCodeExpire:{
         type:Date,
     }*/
})

/*
UserSchema.path('email').validate(async (email) => {
    const userCount = await mongoose.models.User.countDocuments({ email })
    return !userCount
}, 'Bu E-posta zaten bir hesaba tanımlı.')
*/

UserSchema.methods.getForgotPasswordToken = function() {

    const hexadecimal = crypto.randomBytes(15).toString('hex')

    const forgotPasswordToken = crypto.createHash('sha256').update(hexadecimal).digest('hex')

    this.forgotPasswordToken = forgotPasswordToken

    this.forgotPasswordTokenExpire = Date.now() + parseInt(process.env.FORGOT_PASSWORD_TOKEN_EXPIRE)

    return forgotPasswordToken


}

UserSchema.methods.getEmailCheckCode = function() {
    let randomCode = ''
    for (let r = 0; r < 8; r++) {
        randomCode += Math.floor(Math.random() * 10).toString()
    }

    this.checkEmailCode = randomCode
    this.checkEmailCodeExpire = Date.now() + parseInt(process.env.EMAIL_CHECK_CODE_EXPIRE)

    return randomCode

}

UserSchema.pre('save', function(next) {

    if (!this.isModified('password')) return next()
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return res.status(500).render('pages/error/500')
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return res.status(500).render('pages/error/500')
            this.password = hash
            next()
        })

    })

})

UserSchema.pre('save', async function(next) {
    try {
        console.log(this.email)
        if (!this.isModified('email')) return next()
        const email = this.email
        const userCount = await mongoose.models.User.countDocuments({ email })
        console.log(userCount)
        if (!userCount) {
            next()
        } else {
            return next(new CustomError('Bu E-posta zaten bir hesaba tanımlı!', 400))
        }

    } catch (err) {
        next(err)
    }

})
UserSchema.pre('save', function(next) {
    if (!this.isModified('name')) {
        return next()
    }
    const slugName = slugify(this.name, {
        replacement: '-',
        remove: /[*+~.()?'"!:@#]/g,
        lower: true,
    })
    this.slugName = uniqId(slugName)
    next()

})

UserSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('block')) return next()


        await BlogModel.updateMany({ user: this._id }, { isUserBlock: this.block })

        await CommentModel.updateMany({ user: this._id }, { isUserBlock: this.block })
        next()

    } catch (err) {
        return next(err)
    }


})

UserSchema.pre('remove', async function(next) {

    try {
        const userId = this._id

        await BlogModel.deleteMany({ user: userId })

        await CommentModel.deleteMany({ user: userId })

    } catch (err) {
        console.log(err)
        return next(err)
    }

})


UserSchema.post('remove', function() {

    if (this.profileImg != 'default.png') {
        fs.unlink(path.join(rootDir, `/assets/image/profileImage/${this.profileImg}`), (err => {
            if (err) console.log(err)
        }))
    }
})


const User = mongoose.model('User', UserSchema)
module.exports = User
const BlogModel = require('./blog')
const CommentModel = require('./comment')

