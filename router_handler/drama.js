// 导入数据库操作模块
const db = require('../db/index')
const {query} = require("express");

exports.addDrama = (req, res) => {
    let sql = 'select * from dramas where dramaname=?'
    db.query(sql, req.body.dramaname, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 0) return res.cc('此网剧名称已存在，请更换网剧名称后重试')
        let sql = 'INSERT INTO dramas SET ?'
        db.query(sql, req.body, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('添加失败，请稍后再试')
            res.send({
                code: 0, message: '添加成功', data: results
            })
        })
    })
}

exports.getDramasList = (req, res) => {
    let sql = 'SELECT COUNT(*) FROM dramas WHERE is_delete=0 AND dramaname LIKE ? AND platform LIKE ? AND state LIKE ?;SELECT * FROM dramas WHERE is_delete=0 AND dramaname LIKE ? AND platform LIKE ? AND state LIKE ? ORDER BY state DESC LIMIT ? OFFSET ?\n'
    db.query(sql, ['%' + req.query.dramaname + '%', '%' + req.query.platform + '%', '%' + req.query.state + '%', '%' + req.query.dramaname + '%', '%' + req.query.platform + '%', '%' + req.query.state + '%', Number(req.query.pageSize), Number(req.query.pageSize) * (Number(req.query.pageNum) - 1)], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '查询成功', data: results
        })
    })
}

exports.updateDrama = (req, res) => {
    let dramaInfo = {
        dramaname: req.body.dramaname,
        cover_img: req.body.cover_img,
        introduce: req.body.introduce,
        newset: req.body.newset,
        allset: req.body.allset,
        platform: req.body.platform,
        url: req.body.url,
        updatetime: req.body.updatetime,
        category: req.body.category,
        state: req.body.state
    }
    let sql = 'SELECT * FROM dramas WHERE is_delete=0 AND drama_id<>? AND dramaname=?'
    db.query(sql, [req.body.drama_id, req.body.dramaname], (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 0) return res.cc('此网剧名称已存在，请更换网剧名称后重试')
        let sql = 'UPDATE dramas SET ? WHERE drama_id=?'
        db.query(sql, [dramaInfo, req.body.drama_id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新失败，请稍后再试')
            res.cc('更新成功', 0)
        })
    })
}

exports.deleteDrama = (req, res) => {
    const sql = `update dramas set is_delete=1 where drama_id=?`
    db.query(sql, req.body.drama_id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除失败，请稍后重试')
        res.cc('删除成功', 0)
    })
}

//-----------------------------------------------------------------
exports.getDramasListFe = (req, res) => {
    let sql = 'SELECT * FROM dramas WHERE is_delete=0 AND state=? ORDER BY drama_id DESC'
    db.query(sql, req.query.state, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '查询成功', data: results
        })
    })
}
