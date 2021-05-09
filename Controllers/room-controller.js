const Room = require('../models/Room')
const User = require('../models/User')
const Role = require('../models/Role')
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
}

module.exports = new roomController()


