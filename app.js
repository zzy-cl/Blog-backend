const express = require('express')
// 导入路由
const loginRouter = require('./router/login')
const userinfoRouter = require('./router/userinfo')
const artCateRouter = require('./router/artcate')
const artTagRouter = require('./router/arttag')
const articleRouter = require('./router/article')
const incompleteRouter = require('./router/incomplete')
const noticeRouter = require('./router/notice')
const albumRouter = require('./router/album')
const pictureRouter = require('./router/picture')
const otherRouter = require('./router/other')
const dramaRouter = require('./router/drama')

// 创建 express 实例
const app = express()

// 导入 cors 中间件
const cors = require('cors')

const joi = require('joi')

// 导入配置文件
const config = require('./config')

// 解析 token 的中间件
const {expressjwt: jwt} = require("express-jwt");

// 将 cors 注册为全局中间件
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(jwt({secret: config.jwtSecretKey, algorithms: ["HS256"]}).unless({path: [/^\/api\//, /^\/uploads\//]}))

app.use((req, res, next) => {
    res.cc = (err, code = 1) => {
        // code默认为 1
        // err 的值可能是一个错误对象，也有可能是一个字符串
        res.send({
            code, message: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 错误中间件
app.use(function (err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.send({
        code: 1, message: err.message
    })
    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.send({
        code: 1, message: '身份验证失败'
    })
    // 未知错误
    res.send({
        code: 1, message: err.message
    })
})

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

app.use('/api', loginRouter)
app.use('/user', userinfoRouter)
app.use('/artcate', artCateRouter)
app.use('/arttag', artTagRouter)
app.use('/article', articleRouter)
app.use('/incomplete', incompleteRouter)
app.use('/notice', noticeRouter)
app.use('/album', albumRouter)
app.use('/picture', pictureRouter)
app.use('/other', otherRouter)
app.use('/drama', dramaRouter)

app.listen(8080, () => {
    console.log('api server running at http://127.0.0.1:8080')
})
