// 导入数据库操作模块
const db = require('../db/index')

// 获取文章分类列表数据的处理函数
exports.getArticleCates = (req, res) => {
    let catesinfo = req.query
    // order by key asc\desc 排序，升序\降序
    const sql = `SELECT count(*) FROM article_cates a INNER JOIN users b ON a.cate_id like ? AND catename like ? AND a.user_id=b.user_id AND a.is_delete=0;
                 SELECT a.*,b.username FROM article_cates a INNER JOIN users b ON a.is_delete=0 AND a.user_id=b.user_id AND a.cate_id like ? AND catename like ? order by cate_id desc limit ? offset ?`
    db.query(sql, ["%" + catesinfo.cate_id + "%", "%" + catesinfo.catename + "%", "%" + catesinfo.cate_id + "%", "%" + catesinfo.catename + "%", Number(catesinfo.pageSize), Number((catesinfo.pageNum - 1) * catesinfo.pageSize)], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '查询成功', data: results
        })
    })
}

// 新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = `select * from article_cates where catename=?`
    // 执行查重操作
    db.query(sql, [req.body.catename], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 分类名称被占用
        if (results.length === 1) return res.cc('分类名称被占用，请更换后重试！')

        // TODO：新增文章分类
        const sql = `insert into article_cates set ?`
        db.query(sql, [{catename: req.body.catename, user_id: req.auth.user_id}], (err, results) => {
            // SQL 语句执行失败
            if (err) return res.cc(err)

            // SQL 语句执行成功，但是影响行数不等于 1
            // if (results.affectedRows !== 1) return res.cc('新增文章分类失败！')

            // 新增文章分类成功
            res.cc('新增文章分类成功！', 0)
        })


    })

}

// 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    const sql = `update article_cates set is_delete=1 where cate_id=?`
    db.query(sql, req.query.cate_id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // SQL 语句执行成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')

        // 删除文章分类成功
        res.cc('删除文章分类成功！', 0)
    })
}

// 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = `select * from article_cates where cate_id<>? and catename=?`
    // 执行查重操作
    db.query(sql, [req.body.cate_id, req.body.catename], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 分类名称 或 分类别名 被占用
        if (results.length === 1) return res.cc('分类名称被占用，请更换后重试！')

        // TODO：更新文章分类
        const sql = `update article_cates set catename=? where cate_id=?`
        db.query(sql, [req.body.catename, req.body.cate_id], (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err)

            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')

            // 更新文章分类成功
            res.cc('更新文章分类成功！', 0)
        })

    })
}

// 根据分类id获取所对应的文章列表
exports.getCateArticleList = (req, res) => {
    let sql = 'SELECT * FROM articles INNER JOIN article_cates ON articles.is_delete=0 AND article_cates.cate_id=articles.cate_id WHERE article_cates.cate_id=? ORDER BY articles.article_id DESC'
    db.query(sql, req.query.cate_id, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '查询成功', data: results
        })
    })
}
