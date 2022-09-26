// 导入数据库模块
const db = require('../db/index')
// 密码加密
const bcrypt = require('bcryptjs')
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入 token 加密字符串
const config = require('../config')

// 注册
exports.register = (req, res) => {
    const userinfo = req.body
    if (!userinfo.username || !userinfo.password) {
        return res.cc('账号或密码不能为空')
    } else {
        // 定义 sql 语句，是否有重名
        let sql = `select * from users where username=?`
        db.query(sql, userinfo.username, (err, results) => {
            if (err) return res.cc(err)
            if (results.length > 0) {
                return res.cc('账号被占用，请更换账号')
            } else {
                // 密码加密
                userinfo.password = bcrypt.hashSync(userinfo.password, 10)
                let sql = `insert into users set ?`
                db.query(sql, {...userinfo}, (err, results) => {
                    if (err) return res.cc(err)
                    if (results.affectedRows !== 1) {
                        return res.cc('注册失败')
                    } else {
                        res.cc('注册成功', 0)
                    }
                })
            }
        })
    }
}

// 登录
exports.login = (req, res) => {
    const userinfo = req.body
    let sql = `select * from users where username=? and is_delete=0`
    db.query(sql, userinfo.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) {
            // 没有查到对应用户信息
            return res.cc('登陆失败')
        } else {
            const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
            if (compareResult === false) {
                return res.cc('密码错误，请重新输入密码')
            } else {
                // 解构，并且去除 password 和 useravatar
                const user = {...results[0], password: '', useravatar: ''}
                // token 有效期为 2 个小时
                const tokenStr = jwt.sign(user, config.jwtSecretKey, {expiresIn: '2h'})
                res.send({
                    code: 0, message: '登陆成功', token: 'Bearer ' + tokenStr
                })
            }
        }
    })
}
