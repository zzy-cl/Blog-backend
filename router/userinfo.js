const express = require('express')
const userinfoHandler = require('../router_handler/userinfo')
const router = express.Router()

router.get('/userinfo', userinfoHandler.userinfo)

router.post('/userslist', userinfoHandler.userslist)

router.post('/userdelete', userinfoHandler.userdelete)

router.post('/userupdate', userinfoHandler.userupdate)

module.exports = router
