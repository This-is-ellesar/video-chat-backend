const Router = require('express')
const controller = require('./auth-controller')
const { check } = require('express-validator')
const router = new Router()

router.post('/registration/', [
    check('name', 'Имя пользователя не может быть пустым!').notEmpty(),
    check('password', 'Пароль не валидный!').isLength({
        min: 4,
        max: 15
    })
    
], controller.registration)
router.post('/login/', controller.login)
router.get('/users/', controller.getUsers)

module.exports = router