const path = require('path')
const multer = require('multer')
const uniqId = require('uniqid')
const CustomError = require('../../../helpers/error/CustomError')
const rootDir = require('app-root-path').path

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, path.join(rootDir, '/assets/image/profileImage'))
    },
    filename: (req, file, cb) => {
        const extension = file.mimetype.split('/')[1]
        req.profileImg = `image_${uniqId(new Date().toISOString().replace(/[\/\\:]/g, '_'))}.${extension}`

        cb(null, req.profileImg)
    },
})

const fileFilter = (req, file, cb) => {

    let allMimtypes = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif', 'image/PNG']

    if (!allMimtypes.includes(file.mimetype))
        return cb(new CustomError('Resim uzantısı jpg,png,gif veya jpeg olmalıdır.', 400), false)

    cb(null, true)

}

const userProfileImageMulter = multer({ storage, fileFilter })

module.exports = userProfileImageMulter
