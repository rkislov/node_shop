const {Router} = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const router = Router()

router.get('/login', async (req,res)=> {
    res.render('auth/login',{
        title: "Авторизация",
        isLogin: true
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
                res.redirect('/auth/login#login')
            }
        } else {
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
        const candidate = await User.findOne({canEmail})
        if(candidate) {
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
        }

    } catch (error) {
        console.log(error)
    }
})

module.exports = router