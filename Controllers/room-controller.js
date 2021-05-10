const Room = require('../models/Room')
const multer = require('multer')
const { validationResult } = require('express-validator')


class roomController {
    async getRooms(req, res){
        try {
            const rooms = await Room.find()
            res.status(200).json(rooms)
        } catch(e) {
            console.log(e)
        }
    }

    async getRoom(req, res){
        try {
            const room = await Room.find({ _id: req.params.id })

            if(!room) {
                res.status(422).json({ 
                    message: 'Комната не найдена!'
                })
            }

            res.status(200).json(room)
        } catch (error) {
            console.log(error)
        }
    }

    async addRoom(req, res) {
        try{ 
            const errors = validationResult(res)

            if(!errors.isEmpty()){ 
                console.log('Ошибка при создании комнаты: Данные не валидны!')
            }
            const { name } = req.body
            const candidate = await Room.findOne({ name })

            if(candidate) {
                res.status(400).json('Ошибка при создании комнаты: Комната с таким названием уже существует!')
            }   

            if(!name) {
                res.status(400).json('Название комнаты не валидно!')
            }

            const room = new Room({
                name,
                avatar: null,
                users: []
            })

            await room.save()

            res.status(201).json('Комната успешно создана!')
        } catch(e){
            console.log(e)
        }
    }

    async changeRoom(req, res) {
        try {
            let filedata = req.file
            let roomId = req.params.id

            const room = await Room.findOne({
                _id: roomId
            })

            if(!room){
                res.status(400).json('Ошибка при создании комнаты: Комната с таким названием уже существует!')
            }   

            if(!filedata) {
                res.status(400).json({
                    message: 'Ошибка: Не удалось загрузить файл на сервер!'
                })
            }

            room.avatar = req.file.path

            room.save()


            res.status(201).json({
                message: 'Аватарка успешно добавлена!'
            })
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new roomController()


