// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()
// 导入文章的路由处理函数模块
const article_handler = require('../router_handler/article')
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章的验证模块
const {add_article_schema} = require('../schema/article')

const upload = require('../multer/index')

// 发布新文章的路由
// upload.single() 是一个局部生效的中间件，用来解析 FormData 格式的表单数据
// 将文件类型的数据，解析并挂载到 req.file 属性中
// 将文本类型的数据，解析并挂载到 req.body 属性中
router.post('/addarticle', upload.fields([{name: 'content'}]), expressJoi(add_article_schema), article_handler.addArticle)

router.get('/getarticles', article_handler.getArticle)

router.put('/updatetopflag', article_handler.updateTopflag)

router.put('/updatestate', article_handler.updateState)

router.put('/deletearticle', article_handler.deleteArticle)

router.post('/updatearticle', upload.fields([{name: 'updatecontent'}]), article_handler.updateArticle)

// 获取文章分类和标签的路由
router.get('/getartcates', article_handler.getArtCates)
router.get('/getarttags', article_handler.getArtTags)

// 获取文章对应的标签id
router.get('/getarticletags', article_handler.getArticleTags)

//----------------------------------------------------------------------------------------------------------------------

router.get('/getarticlesfe', article_handler.getArticlesFe)

router.get('/getarticletagsfe', article_handler.getArticleTagsFe)

router.get('/getarticlesfeinfo', article_handler.getArticlesFeInfo)

router.get('/getarticlescountfe', article_handler.getArticlesCountFe)

// 向外共享路由对象
module.exports = router
