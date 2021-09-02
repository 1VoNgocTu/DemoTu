const express = require('express')
const mongoose = require('mongoose')
var bodyParser = require('body-parser')
require('dotenv').config()

const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')

const { transformHandler } = require('./middleware/transform/index')
const { errorHandling } = require('./middleware/error/index')

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://123:123@cluster0.qtliw.mongodb.net/Test?retryWrites=true&w=majority', {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        console.log('Connected to MongoDB')
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}

connectDB()

const app = express()
app.use(express.json())
app.use(transformHandler)
app.use(errorHandling)
app.use(bodyParser.urlencoded({ extended: false }))

// cài đặt đường dẫn tĩnh
app.use('/', express.static('public'));

// gọi ejs
app.set('view engine', 'ejs');

// gọi đến controls_controllers
const control_controllers = require('./controllers/control_controllers');
app.use('/', control_controllers);

app.use('/api/auth', authRouter)
app.use('/api/posts', postRouter)

const PORT = 3000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))