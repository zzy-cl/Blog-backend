const express = require('express')
// 导入用户路由处理函数模块
const loginHandler = require('../router_handler/login')
// 创建路由对象
const router = express.Router()

// 1. 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 2. 导入需要的验证规则对象
const {reg_login_schema, reg_register_schema} = require('../schema/login')

// 注册
router.post('/register', expressJoi(reg_register_schema), loginHandler.register)

// 登录
router.post('/login', expressJoi(reg_login_schema), loginHandler.login)

// 导出路由模块
module.exports = router
