// 导入数据库操作模块
const db = require('../db/index')

// 添加待办
exports.addIncomplete = (req, res) => {
    let sql = 'insert into incompletes set ?'
    db.query(sql, req.body, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('添加待办失败，请稍后再试')
        res.cc('添加待办成功', 0)
    })
}

// 查询待办列表
exports.getIncompletesList = (req, res) => {
    let sql = 'SELECT COUNT(*) FROM incompletes WHERE is_delete=0 AND incomplete_id LIKE ? AND is_completed LIKE ?;SELECT * FROM incompletes WHERE is_delete=0 AND incomplete_id LIKE ? AND is_completed LIKE ? ORDER BY is_completed DESC, deadline DESC LIMIT ? OFFSET ?'
    db.query(sql, ['%' + req.query.incomplete_id + '%', '%' + req.query.is_completed + '%', '%' + req.query.incomplete_id + '%', '%' + req.query.is_completed + '%', Number(req.query.pageSize), Number(req.query.pageSize) * (Number(req.query.pageNum) - 1)], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '待办列表查询成功', data: results
        })
    })
}

//修改待办
exports.updateIncomplete = (req, res) => {
    const sql = `update incompletes set ? where incomplete_id=?`
    db.query(sql, [req.body, req.body.incomplete_id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('更新失败，请稍后再试')
        } else {
            res.cc('更新成功', 0)
        }
    })
}

//修改待办是否完成
exports.updateIsIncomplete = (req, res) => {
    const sql = `update incompletes set is_completed=? where incomplete_id=?`
    db.query(sql, [req.body.is_completed, req.body.incomplete_id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('更新失败，请稍后再试')
        } else {
            res.cc('更新成功', 0)
        }
    })
}

// 删除待办
exports.deleteIncomplete = (req, res) => {
    const sql = `update incompletes set is_delete=1 where incomplete_id=?`
    db.query(sql, req.body.incomplete_id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除失败，请稍后重试')
        res.cc('删除成功', 0)
    })
}

//------------------------------------------------------------------------
exports.getIncompletesListFe = (req, res) => {
    let sql = "SELECT * FROM incompletes WHERE is_delete=0 ORDER BY is_completed DESC, deadline DESC"
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '待办列表查询成功', data: results
        })
    })
}
