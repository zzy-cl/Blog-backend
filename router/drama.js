// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()

const drama_handler = require('../router_handler/drama')

router.get('/getdramasList', drama_handler.getDramasList)

router.post('/adddrama', drama_handler.addDrama)

router.put('/updatedrama', drama_handler.updateDrama)

router.post('/deletedrama', drama_handler.deleteDrama)

//-------------------------------------------------------------

router.get('/getdramaslistfe', drama_handler.getDramasListFe)

module.exports = router
