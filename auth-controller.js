const User = require('./models/User')
const Role = require('./models/Role')
const  bcrypt = require('bcryptjs');


class authController { 
  async registration(req, res) {
    try {
      const { username, password } = req.body
      const condidate = await User.findOne({username})

      if(condidate) {
        return res.status(400).json({ 
          massage: 'Такой пользователь уже зарегистрирован в системе'
        })
      }

      const  hashPass = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ 
        value: 'user'
      })
      const user = new User({ 
        username, 
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
          
    } catch (error) {
      console.log(error)
      res.status(400).json({ 
        message: `Login error: ${error}`
      })
    }
  }
  async getUsers(req, res){
    try {
      res.json('server work')
    } catch (error) {
      console.log(error)
    }
  }
  async addRole(req, res) {
    try {
          
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new authController()