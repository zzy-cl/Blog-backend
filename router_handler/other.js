// 导入数据库操作模块
const db = require('../db/index')

exports.updateTotalCount = (req, res) => {
    let sql = 'UPDATE other SET total_count=total_count+1 WHERE id=1;SELECT total_count FROM other WHERE id=1'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0,
            message: '更新及查询成功',
            data: results
        })
    })
}
