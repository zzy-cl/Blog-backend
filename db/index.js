// 导入 mysql 模块
const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    // user: 'blog-db',
    password: '20010307',
    database: 'blog-db',
    timezone: 'Asia/Shanghai', // 设置时区 ！！！
    multipleStatements: true, // 是否允许一个 query 有多条 sql 语句
    connectTimeout: 3000 // 超时时间，单位 ms
})

// 向外共享 db 数据库连接对象
module.exports = db
