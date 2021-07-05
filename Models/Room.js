const { Schema, model} = require('mongoose')

const Room = new Schema({
    name: { type: String, unique: true, required: true },
    avatar: { type: String }, 
    users: [{ type: String, ref: 'User'}]
})

module.exports = model('room', Room)