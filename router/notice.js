// 导入 express 
const express = require('express')

// 导入 router
const router = express.Router()


const notice_handler = require('../router_handler/notice')

router.post('/addnotice', notice_handler.addNotice)

router.get('/getnoticeslist', notice_handler.getNoticesList)

router.put('/updatenotice', notice_handler.updateNotice)

router.post('/deletenotice', notice_handler.deleteNotice)

module.exports = router