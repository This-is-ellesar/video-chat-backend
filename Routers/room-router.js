const Router = require('express')
const controller = require('../Controllers/room-controller')
const { check } = require('express-validator')
const router = new Router()

router.post('/add_room/', controller.addRoom)
router.get('/rooms/', controller.getRooms)


module.exports = router