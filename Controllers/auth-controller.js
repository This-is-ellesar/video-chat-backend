const User = require('../models/User')
const Role = require('../models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { secret } = require('../config')


const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles
  }

  return jwt.sign(payload, secret, { 
    expiresIn: "24h"
  })
}

class authController { 
  async registration(req, res) {
    try {
      const errors = validationResult(req)

      if(!errors.isEmpty()) {
        return res.status(400).json({
          message: `Ошибка при регистрации: Данные не валидны!`
        })
      }

      const { 
        name, 
        surname,
        nickname, 
        password 
      } = req.body
      const condidate = await User.findOne({name})

      if(condidate) {
        return res.status(400).json({ 
          massage: 'Такой пользователь уже зарегистрирован в системе'
        })
      }

      const hashPass = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ 
        value: 'user'
      })
      const user = new User({ 
        name,
        surname,
        nickname, 
        password: hashPass, 
        roles: [userRole.value] 
      })

      await user.save()

      res.status(200).json({ 
        message: 'Пользователь успешно зарегистрирован'
      })

    } catch (error) {
      console.log(error)
      res.status(400).json({ 
        message: `Registration error: ${error}`
      })
    }        
  }
  async login(req, res) {
    try {
      const {
        name,
        password
      } = req.body

      const user = await User.findOne({ 
        name, 
      })

      if(!user){
        return res.status(400).json({
          message: `Пользователь с именем ${name} не зарегистрирован!`
        })
      }

      const validPass = bcrypt.compareSync(password, user.password)

      if(!validPass) {
        return res.status(400).json({
          message: `Неправильное имя пользователя или пароль!`
        })
      }


      const token = generateAccessToken(user._id, user.roles)
      
      return res.status(200).json({ 
        user,
        token
      })

    } catch (error) {
      console.log(error)
      res.status(400).json({ 
        message: `Login error: ${error}`
      })
    }
  }
  async getUsers(req, res){
    try {
      const users = await User.find()
      res.status(200).json(users)
    } catch (error) {
      console.log(error)
    }
  }
  async getUser (req, res) {
    try {
      const user = await User.find({_id: req.params.id})

      if(!user) {
        res.status(422).json({
          message: 'Пользователь не наден!'
        })
      }
  
      res.status(200).json(user)
    } catch(e){
      console.log(e)
    }
  }
}

module.exports = new authController()