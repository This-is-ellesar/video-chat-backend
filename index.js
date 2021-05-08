const express = require('express')
const mongoose = require('mongoose')
const router = require('./auth-router')
const PORT = process.env.PORT || 3000


const app = express()

app.use(express.json())
app.use('/auth', router)


const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://Ellesar:Ellesaradmin1@cluster0.rf9a8.mongodb.net/Video-chat?retryWrites=true&w=majority')
        app.listen(PORT, () => console.log(`server started on poer ${PORT}`))
    } catch(e) {
        console.log(e)
    }
}

start()