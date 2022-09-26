// 导入 express
const express = require('express')

// 导入 router
const router = express.Router()


const incomplete_handler = require('../router_handler/incomplete')

router.post('/addincomplete', incomplete_handler.addIncomplete)

router.get('/getincompleteslist', incomplete_handler.getIncompletesList)

router.put('/updateincomplete', incomplete_handler.updateIncomplete)

router.post('/deleteincomplete', incomplete_handler.deleteIncomplete)

router.put('/updateisincomplete', incomplete_handler.updateIsIncomplete)

//----------------------------------------------------------------------------

router.get('/getincompleteslistfe', incomplete_handler.getIncompletesListFe)

module.exports = router
