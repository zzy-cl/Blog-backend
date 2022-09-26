// 导入数据库操作模块
const db = require('../db/index')

// 添加图片
exports.addPicture = (req, res) => {
    let regex = /^http[\S]*/gm
    let srclist = req.body.src.match(regex)

    for (let i = 0; i < srclist.length; i++) {
        let sql = 'select * from pictures where album_id=? and src=?'
        db.query(sql, [req.body.album_id, srclist[i]], (err, results) => {
            if (err) return res.cc(err)
            if (results.length === 0) {
                let sql = 'insert into pictures set ?'
                db.query(sql, {
                    album_id: req.body.album_id, src: srclist[i], user_id: req.auth.user_id
                }, (err, results) => {
                    if (err) return res.cc(err)
                    if (results.affectedRows !== 1) return res.cc('有图片上传失败，请稍后再试')
                })
            }
        })
        if (i === srclist.length - 1) {
            return res.send({
                code: 0, message: '全部图片上传成功'
            })
        }
    }
}

// 查询图片列表
exports.getPicturesList = (req, res) => {
    let pictureInfo = req.query
    let sql = `SELECT count(*) FROM ((pictures INNER JOIN albums ON pictures.is_delete=0 AND albums.is_delete=0 AND pictures.album_id=albums.album_id) INNER JOIN users ON users.is_delete=0 AND pictures.user_id=users.user_id) WHERE albums.albumname LIKE ? AND users.username 
    LIKE ?;SELECT pictures.*,albums.albumname,users.username FROM ((pictures INNER JOIN albums ON pictures.is_delete=0 AND albums.is_delete=0 AND pictures.album_id=albums.album_id) INNER JOIN users ON users.is_delete=0 AND pictures.user_id=users.user_id) WHERE albums.albumname LIKE ? AND users.username 
    LIKE ? ORDER BY pictures.picture_id DESC LIMIT ? OFFSET ?`
    db.query(sql, ['%' + pictureInfo.albumname + '%', '%' + pictureInfo.username + '%', '%' + pictureInfo.albumname + '%', '%' + pictureInfo.username + '%', Number(pictureInfo.pageSize), Number(pictureInfo.pageSize) * (Number(pictureInfo.pageNum) - 1)], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '图片列表查询成功', data: results
        })
    })
}

//修改图片信息
exports.updatePicture = (req, res) => {
    let pictureInfo = {
        album_id: req.body.album_id, src: req.body.src, user_id: req.auth.user_id
    }
    const sql = `update pictures set ? where picture_id=?`
    db.query(sql, [pictureInfo, req.body.picture_id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('更新失败，请稍后再试')
        } else {
            res.cc('更新成功', 0)
        }
    })
}

// 删除图片
exports.deletePicture = (req, res) => {
    const sql = `update pictures set is_delete=1 where picture_id=?`
    db.query(sql, req.body.picture_id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('删除失败，请稍后重试')
        res.cc('删除成功', 0)
    })
}

// 查询所有的相册名称
exports.getAlbumname = (req, res) => {
    let sql = 'SELECT * FROM albums WHERE is_delete=0'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '查询成功', data: results
        })
    })
}

// 查询所有的用户名称
exports.getUsername = (req, res) => {
    let sql = 'SELECT user_id,username FROM users WHERE is_delete=0'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '查询成功', data: results
        })
    })
}

// 查询相册id所对应的所有图片
exports.getAlbumPictureList = (req, res) => {
    let sql = 'SELECT * FROM pictures WHERE is_delete=0 AND album_id=? order by picture_id desc'
    db.query(sql, Number(req.query.album_id), (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '查询成功', data: results
        })
    })
}

// 查询所有的相册
exports.getAlbumsList = (req, res) => {
    let sql = 'SELECT * FROM albums WHERE is_delete=0 order by album_id desc'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '查询成功', data: results
        })
    })
}
