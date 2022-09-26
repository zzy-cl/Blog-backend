// 导入定义验证规则的模块
const joi = require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必填项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 定义 标签名称 和 标签别名 的校验规则
const tagname = joi.string().min(2).max(8).required()
// 定义 标签Id 的校验规则
const tag_id = joi.number().min(1).required()

// 校验规则对象 - 添加标签
exports.add_tag_schema = {
    body: {
        tagname
    },
}
// 校验规则对象 - 更新标签
exports.update_tag_schema = {
    body: {
        tag_id,
        tagname
    },
}
