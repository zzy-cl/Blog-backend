// 导入数据库操作模块
const db = require('../db/index')

// 添加公告
exports.addNotice = (req, res) => {
    let sql = 'insert into notices set ?'
    db.query(sql, [{...req.body, user_id: req.auth.user_id}], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('添加公告失败，请稍后再试')
        res.cc('添加公告成功', 0)
    })
}

// 查询公告列表
exports.getNoticesList = (req, res) => {
    let sql = 'SELECT * FROM notices WHERE is_delete=0 ORDER BY update_time DESC'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '公告列表查询成功', data: results
        })
    })
}

//修改公告内容
exports.updateNotice = (req, res) => {
    const sql = `update intices set content=? where notice_id=?`
    db.query(sql, [req.body.is_completed, req.body.incomplete_id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('更新失败，请稍后再试')
        } else {
            res.cc('更新成功', 0)
        }
    })
}

// 删除公告
exports.deleteNotice = (req, res) => {
    const sql = `update notices set is_delete=1 where notice_id=?`
    db.query(sql, req.body.notice_id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除失败，请稍后重试')
        res.cc('删除成功', 0)
    })
}
