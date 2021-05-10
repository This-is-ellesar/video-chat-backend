const express = require('express')
const cors = require('cors')
const multer = require('multer')
const mongoose = require('mongoose')
const authRouter = require('./Routers/auth-router')
const roomRouter = require('./Routers/room-router')
const PORT = process.env.PORT || 5000

//multer 
const storage = multer.diskStorage({
    destination: function(req, res, cb){
        cb(null, './uploads')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})
//

const app = express()

app.use(multer({ storage: storage }).single('filedata'))
app.use(cors())
app.use(express.json())
app.use('/auth', authRouter)
app.use('/room', roomRouter)


const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://Ellesar:Ellesaradmin1@cluster0.rf9a8.mongodb.net/Video-chat?retryWrites=true&w=majority')
        app.listen(PORT, () => console.warn(`Server started on port ${PORT}`))
    } catch(e) {
        console.log(`Server error: ${e}!`)
    }
}

start()