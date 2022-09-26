// 导入 express 
const express = require('express')

// 导入 router
const router = express.Router()


const album_handler = require('../router_handler/album')

router.post('/addalbum', album_handler.addAlbum)

router.get('/getalbumslist', album_handler.getAlbumsList)

router.put('/updatealbum', album_handler.updateAlbum)

router.post('/deletealbum', album_handler.deleteAlbum)

module.exports = router