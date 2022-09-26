// 导入定义验证规则的模块
const joi = require('joi')

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const cate_id = joi.number().required()
const tag_id = joi.string().required()
const state = joi.string().valid('已发布', '未发布').required()
const top_flag = joi.string().valid('已置顶', '未置顶').required()
const cover_img = joi.string().required()

// 验证规则对象 - 发布文章
exports.add_article_schema = {
    body: {
        title,
        cate_id,
        tag_id,
        state,
        top_flag,
        cover_img
    },
}
