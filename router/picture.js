// 导入 express 
const express = require('express')

// 导入 router
const router = express.Router()


const picture_handler = require('../router_handler/picture')

router.post('/addpicture', picture_handler.addPicture)

router.get('/getpictureslist', picture_handler.getPicturesList)

router.put('/updatepicture', picture_handler.updatePicture)

router.post('/deletepicture', picture_handler.deletePicture)

router.get('/getalbumname', picture_handler.getAlbumname)

router.get('/getusername', picture_handler.getUsername)

router.get('/getalbumpicturelist',picture_handler.getAlbumPictureList)

router.get('/getalbumslist',picture_handler.getAlbumsList)

module.exports = router