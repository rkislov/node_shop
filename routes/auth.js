const {Router} = require('express')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const keys = require('../keys')
const regEmail = require('../emails/registration')
const sendgrid = require('nodemailer-sendgrid-transport')
const User = require('../models/user')
const router = Router()

const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.SENDGRID_API_KEY }
}))

router.get('/login', async (req,res)=> {
    res.render('auth/login',{
        title: "Авторизация",
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    })
})

router.post('/login', async (req,res) => {
    try {
        const {email, password} = req.body

        const candidate = await User.findOne({ email })
        

        if(candidate) {
            const areSame = await bcrypt.compare(password, candidate.password)

            if (areSame) {
                const user = candidate
                req.session.user = user
                req.session.isAuthenticated = true
                req.session.save(err => {
                    if (err) {
                        throw err
                    } else {
                        res.redirect('/')  
                    }
                })
            } else {
                req.flash('loginError', 'Не верный пароль')
                res.redirect('/auth/login#login')
            }
        } else {
            req.flash('loginError', 'Такого пользователя нет')
            res.redirect('/auth/login#login')
        }


    } catch (error) {
        console.log(error)
    }
    
    
})

router.get('/logout', async (req,res) =>{
    req.session.destroy(() => {
        res.redirect('/auth/login#login')
    })
    
})

router.post('/register', async (req,res)=> {
    try {
        // const {email, name, password, repeat} = req.body
        //console.log(req.body)
        const password = req.body.rpassword
        const canEmail = req.body.remail
        const candidate = await User.findOne({email: canEmail})
        if(candidate) {
            req.flash('registerError', 'Пользователь с таким email уже существует')
            res.redirect('/auth/login#register')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email: req.body.remail, 
                name: req.body.name, 
                password: hashPassword, 
                cart: {items: []}
            })
            await user.save()
            res.redirect('/auth/login#login')
            await transporter.sendMail(regEmail(user.email))
        }

    } catch (error) {
        console.log(error)
    }
})

module.exports = router