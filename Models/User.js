const { Schema, model} = require('mongoose')


const User = new Schema({
    name: { type: String, unique: true, required: true },
    surname: { type: String, unique: true, required: true },
    nickname: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: { type: String },
    roles: [{ type: String, ref: 'Role'}]
})

module.exports = model('user', User)