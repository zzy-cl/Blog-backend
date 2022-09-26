// 导入处理路径的 path 核心模块
const path = require('path')
// 导入数据库操作模块
const db = require('../db/index')
//事件处理模块
const dayjs = require('dayjs')

// 获取全部文章分类
exports.getArtCates = (req, res) => {
    let sql = `select * from article_cates where is_delete=0`
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        return res.send({
            code: 0, message: '查询成功', data: results
        })
    })
}

// 获取全部文章标签
exports.getArtTags = (req, res) => {
    let sql = `select * from article_tags where is_delete=0`
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        return res.send({
            code: 0, message: '查询成功', data: results
        })
    })
}

// 发布新文章的处理函数
exports.addArticle = (req, res) => {
    // 手动判断是否上传了文章封面
    // if (!req.files || !req.files.cover_img || req.files.cover_img[0].fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')
    // TODO：表单数据合法，继续后面的处理流程...
    const articleInfo = {
        // 标题、内容、状态、所属的分类Id
        title: req.body.title, content: path.join('/uploads', req.files.content[0].filename), // 文章在服务器端的存放路径
        cover_img: req.body.cover_img, publish_time: dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'), // 获取发表日期
        state: req.body.state, cate_id: req.body.cate_id, user_id: req.auth.user_id, top_flag: req.body.top_flag
    }
    const sql = `insert into articles set ?`
    // 执行 SQL 语句
    db.query(sql, articleInfo, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('发布文章失败！')

        let tag_id = JSON.parse(req.body.tag_id)
        let article_id = results.insertId

        for (let i = 0; i < tag_id.length; i++) {

            let sql = 'INSERT INTO `articles-tags` (article_id,tag_id) VALUES (?,?)'
            db.query(sql, [article_id, tag_id[i]], (err, results) => {
                if (err) return res.cc(err)
                if (results.affectedRows !== 1) return res.cc("文章标签插入失败")
            })
        }
        // 发布文章成功
        res.cc('发布文章成功', 0)
    })
}
// 获取文章列表
exports.getArticle = (req, res) => {
    let articleinfo = req.query
    let sql = "SELECT COUNT(*) FROM ((articles INNER JOIN article_cates ON articles.is_delete=0 AND articles.cate_id=article_cates.cate_id) INNER JOIN users ON articles.user_id=users.user_id) WHERE title LIKE ? AND catename LIKE ? AND username LIKE ? AND state LIKE ?;" + "SELECT articles.*,article_cates.catename,users.username FROM ((articles INNER JOIN article_cates ON articles.is_delete=0 AND articles.cate_id=article_cates.cate_id) INNER JOIN users ON articles.user_id=users.user_id) WHERE title LIKE ? AND catename LIKE ? AND username LIKE ? AND state LIKE ? ORDER BY article_id DESC LIMIT ? OFFSET ?"
    db.query(sql, ['%' + articleinfo.title + '%', '%' + articleinfo.catename + '%', '%' + articleinfo.username + '%', '%' + articleinfo.state + '%', '%' + articleinfo.title + '%', '%' + articleinfo.catename + '%', '%' + articleinfo.username + '%', '%' + articleinfo.state + '%', Number(articleinfo.pageSize), Number((articleinfo.pageNum - 1) * articleinfo.pageSize)], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '查询成功', data: results
        })
    })
}
//修改文章是否置顶
exports.updateTopflag = (req, res) => {
    const sql = `update articles set top_flag=? where article_id=?`
    db.query(sql, [req.body.top_flag, req.body.article_id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('更新失败，请稍后再试')
        } else {
            res.cc('更新成功', 0)
        }
    })
}

//修改文章发布状态
exports.updateState = (req, res) => {
    const sql = `update articles set state=? where article_id=?`
    if (req.body.state === '未发布') {
        db.query(sql, [req.body.state, req.body.article_id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) {
                return res.cc('更新失败，请稍后再试')
            } else {
                res.cc('更新成功', 0)
            }
        })
    } else {
        const sql = `update articles set state=?,publish_time=? where article_id=?`
        db.query(sql, [req.body.state, dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'), req.body.article_id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) {
                return res.cc('更新失败，请稍后再试')
            } else {
                res.cc('更新成功', 0)
            }
        })
    }
}
// 删除文章
exports.deleteArticle = (req, res) => {
    const sql = `update articles set is_delete=1 where article_id=?`
    db.query(sql, req.body.article_id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除失败，请稍后重试')
        res.cc('删除成功', 0)
    })
}

// 根据文章id获取对应的标签id
exports.getArticleTags = (req, res) => {
    let sql = 'SELECT tag_id FROM `articles-tags` WHERE article_id=?'
    db.query(sql, req.query.article_id, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '标签查询成功', data: results
        })
    })
}

// 更新文章
exports.updateArticle = (req, res) => {
    const articleinfo = req.body
    // 将 tag_id 从字符串形式转化成数组形式
    articleinfo.tag_id = articleinfo.tag_id.match(/[0-9]+/g)

    // 先查询出原先文章和标签的对应关系，删掉！
    // 然后插入新的对应关系！
    let sql = 'DELETE FROM `articles-tags` WHERE article_id=?'
    db.query(sql, articleinfo.article_id, (err, results) => {
        if (err) return res.cc(err)
        // res.cc('旧标签删除成功', 0)
        let sql = 'INSERT INTO `articles-tags` (article_id,tag_id) VALUES (?,?)'
        for (let i = 0; i < articleinfo.tag_id.length; i++) {
            db.query(sql, [articleinfo.article_id, Number(articleinfo.tag_id[i])], (err, results) => {
                if (err) return res.cc(err)
                if (results.affectedRows !== 1) return res.cc("文章标签插入失败")
            })
        }
    })
    // 更新其他内容
    sql = `select * from articles where article_id<>? and title=?`
    db.query(sql, [articleinfo.article_id, articleinfo.title], (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 0) return res.cc('文章标题已经被占用，请更换后重试')
        // console.log(articleinfo)
        const sql = `update articles set title=?,cate_id=?,cover_img=? where article_id=?`
        db.query(sql, [articleinfo.title, articleinfo.cate_id, articleinfo.cover_img, articleinfo.article_id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新失败，请稍后再试')
            res.cc('更新成功', 0)
        })
    })
}
// -------------------------------------------------------------------
// 获取文章列表---前端首页列表、文章归档
exports.getArticlesFe = (req, res) => {
    // 对文章信息进行倒序查询
    let sql = `SELECT COUNT(*) FROM articles WHERE is_delete=0;
               SELECT articles.*,article_cates.catename,users.username FROM ((articles INNER JOIN article_cates ON articles.cate_id=article_cates.cate_id) INNER JOIN users ON articles.user_id=users.user_id) WHERE articles.is_delete=0 AND articles.state='已发布' ORDER BY articles.top_flag ASC,article_id DESC LIMIT ? OFFSET ?`
    db.query(sql, [Number(req.query.pageSize), Number((req.query.pageNum - 1) * req.query.pageSize)], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '查询成功', data: results
        })
    })
}

// 根据文章id获取对应的标签名称
exports.getArticleTagsFe = (req, res) => {
    let sql = 'SELECT `articles-tags`.tag_id,article_tags.tagname FROM `articles-tags` INNER JOIN article_tags ON `articles-tags`.article_id=? AND `articles-tags`.tag_id=article_tags.tag_id'
    db.query(sql, req.query.article_id, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '标签查询成功', data: results
        })
    })
}

// 获取文章id对应的详细内容
exports.getArticlesFeInfo = (req, res) => {
    // 对文章信息进行倒序查询
    let sql = `UPDATE articles SET read_count=read_count+1 WHERE article_id=?;SELECT articles.*,article_cates.catename,users.username FROM ((articles INNER JOIN article_cates ON articles.article_id=? AND articles.cate_id=article_cates.cate_id) INNER JOIN users ON articles.user_id=users.user_id)`
    db.query(sql, [req.query.article_id, req.query.article_id], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '查询成功', data: results
        })
    })
}

// 获取所有的文章数量
exports.getArticlesCountFe = (req, res) => {
    // 对文章信息进行倒序查询
    let sql = `SELECT COUNT(*) FROM articles WHERE is_delete=0`
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '查询成功', data: results
        })
    })
}

