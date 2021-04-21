const express = require('express')
const categoryController = require('../../controllers/category')
const authorization = require('../../middlewares/authorization/authorization')
const joiValidator = require('../../middlewares/libraryMiddlewares/joi/joiValidator')
const joiSchema = require('../../helpers/validation/joiSchema')


const router = express.Router()


router.get('/', categoryController.categories)

router.post('/',
    joiValidator(joiSchema.categorySchema, 'category'),
    authorization.apiIsAdmin,
    categoryController.addCategory,
)

router.put('/:categoryId',
    joiValidator(joiSchema.categorySchema, 'category'),
    authorization.apiIsAdmin,
    categoryController.editCategory,
)

router.delete('/:categoryId',
    authorization.apiIsAdmin,
    categoryController.deleteCategory,
)


module.exports = router
