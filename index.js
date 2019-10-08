const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const cardRoutes = require('./routes/card')
const User = require('./models/user')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req,res,next)=> {
    try {
        const user = await User.findById('5d9b87dc4640f65845aec916')
        req.user = user
        next()
    } catch (error) {
        console.log(error)
    }
})
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes)
app.use('/courses',coursesRoutes)
app.use('/card',cardRoutes)


const PORT = process.env.PORT || 3000

async function start () {
    try {
        const url = `mongodb://localhost:27017/shop`
        await mongoose.connect(url, {
            useNewUrlParser:true, 
            useUnifiedTopology: true,
            useFindAndModify: false        
        })
        const candidate = await User.findOne()
        if(!candidate) {
            const user = new User ({
                email: 'roman@kislovs.ru',
                name: 'Роман Кислов',
                cart: {items: []}
            })
            await user.save()
        }
    
        app.listen(PORT, ()=> {
            console.log(`server is running on port ${PORT}`)
        })

    } catch (e) {
        console.log(e)
    }
    
}
start()



