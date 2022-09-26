const joi = require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 用户名的验证规则
const username = joi.string().min(2).max(10).required()
// 密码的验证规则
const password = joi.string().pattern(/^[\S]{5,12}$/).required()
// 邮箱
const email = joi.string().min(8).max(20).required()
// 电话验证规则
const mobile = joi.string().min(11).max(11).required()

// 登录表单的验证规则对象
exports.reg_login_schema = {
    // 表示需要对 req.body 中的数据进行验证
    body: {
        username,
        password,
    },
}
// 注册表单的验证规则对象
exports.reg_register_schema = {
    // 表示需要对 req.body 中的数据进行验证
    body: {
        username,
        password,
        mobile,
        email
    },
}