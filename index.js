const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const authRouter = require('./Routers/auth-router')
const roomRouter = require('./Routers/room-router')
const PORT = process.env.PORT || 5000


const app = express()

app.use(cors())
app.use(express.json())
app.use('/auth', authRouter)
app.use('/room', roomRouter)


const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://Ellesar:Ellesaradmin1@cluster0.rf9a8.mongodb.net/Video-chat?retryWrites=true&w=majority')
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch(e) {
        console.log(`Server error: ${e}!`)
    }
}

start()