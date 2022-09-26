// 导入数据库操作模块
const db = require('../db/index')

// 获取文章标签列表数据的处理函数
exports.getArticletags = (req, res) => {
    let tagsinfo = req.query
    // order by key asc\desc 排序，升序\降序
    const sql = `SELECT count(*) FROM article_tags a INNER JOIN users b ON a.tag_id like ? AND tagname like ? AND a.user_id=b.user_id AND a.is_delete=0;
                 SELECT a.*,b.username FROM article_tags a INNER JOIN users b ON a.is_delete=0 AND a.user_id=b.user_id AND a.tag_id like ? AND tagname like ? order by tag_id desc limit ? offset ?`
    db.query(sql, ["%" + tagsinfo.tag_id + "%", "%" + tagsinfo.tagname + "%", "%" + tagsinfo.tag_id + "%", "%" + tagsinfo.tagname + "%", Number(tagsinfo.pageSize), Number((tagsinfo.pageNum - 1) * tagsinfo.pageSize)], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '查询成功', data: results
        })
    })
}

// 新增文章标签的处理函数
exports.addArticletags = (req, res) => {
    // 定义查询 标签名称 与 标签别名 是否被占用的 SQL 语句
    const sql = `select * from article_tags where tagname=?`
    // 执行查重操作
    db.query(sql, [req.body.tagname], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 标签名称被占用
        if (results.length === 1) return res.cc('标签名称被占用，请更换后重试！')

        // TODO：新增文章标签
        const sql = `insert into article_tags set ?`
        db.query(sql, [{tagname: req.body.tagname, user_id: req.auth.user_id}], (err, results) => {
            // SQL 语句执行失败
            if (err) return res.cc(err)

            // SQL 语句执行成功，但是影响行数不等于 1
            // if (results.affectedRows !== 1) return res.cc('新增文章标签失败！')

            // 新增文章标签成功
            res.cc('新增文章标签成功！', 0)
        })


    })

}

// 删除文章标签的处理函数
exports.deletetagById = (req, res) => {
    const sql = `update article_tags set is_delete=1 where tag_id=?`
    db.query(sql, req.query.tag_id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('删除文章标签失败！')

        // 删除文章标签成功
        res.cc('删除文章标签成功！', 0)
    })
}

// 更新文章标签的处理函数
exports.updatetagById = (req, res) => {
    // 定义查询 标签名称 与 标签别名 是否被占用的 SQL 语句
    const sql = `select * from article_tags where tag_id<>? and tagname=?`
    // 执行查重操作
    db.query(sql, [req.body.tag_id, req.body.tagname], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 标签名称 或 标签别名 被占用
        if (results.length === 1) return res.cc('标签名称被占用，请更换后重试！')

        // TODO：更新文章标签
        const sql = `update article_tags set tagname=? where tag_id=?`
        db.query(sql, [req.body.tagname, req.body.tag_id], (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err)

            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('更新文章标签失败！')

            // 更新文章标签成功
            res.cc('更新文章标签成功！', 0)
        })

    })
}

// 根据标签id获取所对应的文章列表
exports.getTagArticleList = (req, res) => {
    let sql = 'SELECT articles.* FROM ((articles INNER JOIN `articles-tags` ON articles.is_delete=0 AND articles.article_id=`articles-tags`.article_id) INNER JOIN article_tags ON `articles-tags`.tag_id=article_tags.tag_id) WHERE article_tags.tag_id=? ORDER BY articles.article_id DESC'
    db.query(sql, req.query.tag_id, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '查询成功', data: results
        })
    })
}
