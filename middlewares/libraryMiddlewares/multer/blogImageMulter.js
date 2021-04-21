const path = require('path')
const multer = require('multer')
const uniqId = require('uniqid')
const CustomError = require('../../../helpers/error/CustomError')
const rootDir = require('app-root-path').path


const storage = multer.diskStorage({

    //gelen resmi hangi dosya yoluna kayıt edeceğimizi söylüyoruz
    destination: (req, file, cb) => {
        cb(null, path.join(rootDir, '/assets/image/blogImage'))
    },

    filename: (req, file, cb) => {

        const extension = file.mimetype.split('/')[1]

        req.blogTitleImage = `image_${uniqId(new Date().toISOString().replace(/[\/\\:]/g, '_'))}.${extension}`
        console.log(req.blogTitleImage)

        cb(null, req.blogTitleImage)
    },
})

const fileFilter = (req, file, cb) => {

    let allMimtypes = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif']
    //burada gelen resimlerini uzantılarını filitreledik
    if (!allMimtypes.includes(file.mimetype))
        return cb(new CustomError('Resim uzantısı jpg,png,gif veya jpeg olmalıdır.', 400), false)

    cb(null, true)


}

const blogImageMulter = multer({ storage, fileFilter })


module.exports = blogImageMulter
