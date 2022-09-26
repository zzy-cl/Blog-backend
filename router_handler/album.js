// 导入数据库操作模块
const db = require('../db/index')

// 添加相册
exports.addAlbum = (req, res) => {
    if (req.body.cover_img === '') {
        req.body.cover_img = 'https://s1.imagehub.cc/images/2022/09/14/619e1eaae46bb2e769ade4f2d42285f8.png'
    }

    let sql = 'select * from albums where albumname=? and is_delete=0'
    db.query(sql, req.body.albumname, (err, results) => {
        if (err) return res.cc(err)
        if (results.length === 1) return res.cc('相册名已经存在，请更换后重试')
        let sql = 'insert into albums set ?'
        db.query(sql, {...req.body, user_id: req.auth.user_id}, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('添加相册失败，请稍后再试')
            res.cc('添加相册成功', 0)
        })
    })
}

// 查询相册列表
exports.getAlbumsList = (req, res) => {
    let albumInfo = req.query
    let sql = `SELECT count(*) FROM albums INNER JOIN users ON albums.is_delete=0 AND albums.user_id=users.user_id WHERE albums.album_id LIKE ? AND albums.albumname LIKE ?;SELECT albums.*,users.username FROM albums INNER JOIN users ON albums.is_delete=0 AND albums.user_id=users.user_id WHERE albums.album_id LIKE ? AND albums.albumname LIKE ? ORDER BY albums.album_id DESC LIMIT ? OFFSET ?`
    db.query(sql, ['%' + albumInfo.album_id + '%', '%' + albumInfo.albumname + '%', '%' + albumInfo.album_id + '%', '%' + albumInfo.albumname + '%', Number(albumInfo.pageSize), Number(albumInfo.pageSize) * (Number(albumInfo.pageNum) - 1)], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '相册列表查询成功', data: results
        })
    })
}

//修改相册信息
exports.updateAlbum = (req, res) => {
    let albumInfo = {
        album_id: req.body.album_id,
        albumname: req.body.albumname,
        cover_img: req.body.cover_img,
        introduce: req.body.introduce,
        user_id: req.auth.user_id
    }
    const sql = `update albums set ? where album_id=?`
    db.query(sql, [albumInfo, req.body.album_id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('更新失败，请稍后再试')
        } else {
            res.cc('更新成功', 0)
        }
    })
}

// 删除相册
exports.deleteAlbum = (req, res) => {
    const sql = `update albums set is_delete=1 where album_id=?`
    db.query(sql, req.body.album_id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除失败，请稍后重试')
        res.cc('删除成功', 0)
    })
}
