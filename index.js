const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const cardRoutes = require('./routes/card')
const orderRoutes = require('./routes/orders')
const authRoutes = require('./routes/auth')
const User = require('./models/user')
const varMiddleware = require('./middleweare/variables')
const MONGODB_URI = `mongodb://localhost:27017/shop`

const app = express()

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URI

})
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')


app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: 'secret session value',
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(varMiddleware)

app.use('/', homeRoutes)
app.use('/courses',coursesRoutes)
app.use('/card',cardRoutes)
app.use('/orders', orderRoutes)
app.use('/auth', authRoutes)


const PORT = process.env.PORT || 3000

async function start () {
    try {
        
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser:true, 
            useUnifiedTopology: true,
            useFindAndModify: false        
        })
        // const candidate = await User.findOne()
        // if(!candidate) {
        //     const user = new User ({
        //         email: 'roman@kislovs.ru',
        //         name: 'Роман Кислов',
        //         cart: {items: []}
        //     })
        //     await user.save()
        // }
    
        app.listen(PORT, ()=> {
            console.log(`server is running on port ${PORT}`)
        })

    } catch (e) {
        console.log(e)
    }
    
}
start()



