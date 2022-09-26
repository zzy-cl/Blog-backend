// 导入数据库模块
const db = require('../db/index')

// 获取当前登录人的信息
exports.userinfo = (req, res) => {
    // 根据用户的 user_id，查询用户的基本信息
    // 注意：为了防止用户的密码泄露，需要排除 password 字段
    const sql = `select user_id, username,user_rights, mobile, email, useravatar from users where user_id=?`
    // 注意：req 对象上的 auth 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
    db.query(sql, req.auth?.user_id, (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1
        if (results.length !== 1) return res.cc('获取用户信息失败！')

        // 3. 将用户信息响应给客户端
        res.send({
            status: 0, message: '获取用户基本信息成功！', data: results[0],
        })
    })
}

// 获取全部用户的列表
exports.userslist = (req, res) => {
    const userinfo = req.body
    // 模糊查询
    const sql = `select count(*) from users where is_delete=0 and username like ? and mobile like ? and email like ?;select username,user_rights,mobile,email,useravatar,create_time,update_time from users where is_delete=0 and username like ? and mobile like ? and email like ? limit ? offset ?`
    db.query(sql, ["%" + userinfo.username + "%", "%" + userinfo.mobile + "%", "%" + userinfo.email + "%", "%" + userinfo.username + "%", "%" + userinfo.mobile + "%", "%" + userinfo.email + "%", userinfo.pageSize, (userinfo.pageNum - 1) * userinfo.pageSize], (err, results) => {
        if (err) return res.cc(err)
        res.send({
            code: 0, message: '查询成功', data: results
        })
    })
}

// 删除用户
exports.userdelete = (req, res) => {
    const userinfo = req.body
    const sql = `update users set is_delete=1 where username=?`
    db.query(sql, userinfo.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('删除失败，请稍后再试')
        } else {
            res.cc('删除成功', 0)
        }
    })
}

// 修改用户信息
exports.userupdate = (req, res) => {
    const userinfo = req.body
    const sql = `update users set mobile=?,email=?,useravatar=? where username=?`
    db.query(sql, [userinfo.mobile, userinfo.email, userinfo.useravatar, userinfo.username], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('修改失败，请稍后再试')
        } else {
            res.cc('修改成功', 0)
        }
    })
}
