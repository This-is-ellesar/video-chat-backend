//libs
const Router = require('express')
const controller = require('../Controllers/room-controller')
const { check } = require('express-validator')
const router = new Router()

/**
 * @swagger
 * /add_room/:
 *  post: 
 *     description: Добавить комнату
 *     responses: 
 *      200: 
 *        description: Success
 */
router.post('/add_room/', controller.addRoom)
/**
 * @swagger
 * /rooms/:id/:
 *  patch: 
 *     description: Изменить модель комнаты по id
 *     responses: 
 *      200: 
 *        description: Success
 */
router.patch('/rooms/:id/', controller.changeRoom)
/**
 * @swagger
 * /rooms/:
 *  get: 
 *     description: Получить список всех комнат
 *     responses: 
 *      200: 
 *        description: Success
 */
router.get('/rooms/', controller.getRooms)
/**
 * @swagger
 * /users:
 *  get: 
 *     description: Получить комнату по id
 *     responses: 
 *      200: 
 *        description: Success
 */
router.get('/rooms/:id/', controller.getRoom)


module.exports = router
