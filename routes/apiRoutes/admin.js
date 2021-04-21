const express = require('express')
const router = express.Router()
const queryCheck = require('../../middlewares/database/queryCheck')
const authorization = require('../../middlewares/authorization/authorization')
const adminController = require('../../controllers/admin')


router.get('/:userId/blockOrUndoBlock',
    authorization.apiIsLogin,
    authorization.apiIsAdmin,
    queryCheck.apiUserIdCheck,
    adminController.blockOrUndoBlock,
)


module.exports = router
