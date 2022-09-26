// 导入 express
const express = require('express')

// 导入 router
const router = express.Router()

const other_handler = require('../router_handler/other')

router.get('/updatetotalcount', other_handler.updateTotalCount)

module.exports = router
