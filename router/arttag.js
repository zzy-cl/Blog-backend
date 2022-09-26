// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')

// 导入文章标签的验证模块
const {add_tag_schema, update_tag_schema} = require('../schema/arttag')

// 导入文章标签的路由处理函数模块
const arttag_handler = require('../router_handler/arttag')

// 获取文章标签的列表数据
router.get('/tags', arttag_handler.getArticletags)
// 新增文章标签的路由
router.post('/addtag', expressJoi(add_tag_schema), arttag_handler.addArticletags)
// 删除文章标签的路由
router.get('/deletetag', arttag_handler.deletetagById)
// 更新文章标签的路由
router.post('/updatetag', expressJoi(update_tag_schema), arttag_handler.updatetagById)
// 根据标签id获取对应的所有文章
router.get('/gettagarticlelist', arttag_handler.getTagArticleList)

// 向外共享路由对象
module.exports = router
