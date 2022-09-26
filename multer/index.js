// 导入 multer 模块
const multer = require('multer')
// 导入 path 模块
const path = require('path')

const storage = multer.diskStorage({
    // 上传的文件存放在服务器中的路径
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'))
    },
    filename: function (req, file, cb) {
        let filename = ''
        if (file.fieldname === 'updatecontent') {
            filename = file.originalname
        } else {
            filename = `${Date.now()}.${file.originalname.split('.')[1]}`
        }
        cb(null, filename)
    }
})

const upload = multer({
    storage
})

module.exports = upload
