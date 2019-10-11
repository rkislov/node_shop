const {Router} = require('express')
const Course = require('../models/course')
const auth = require('../middleweare/auth')
const router = Router()

router.get('/', async (req,res)=>{
    const courses = await Course.find()
    .populate('userId', 'email name')
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    })
})

router.get('/add',auth,(req,res)=>{
    res.render('add', {
        title: 'Добавление курса',
        isCourses: true,
    })
})


router.get('/:id/edit', auth,async (req,res)=>{
    if (!req.query.allow) {
        return res.redirect('/')
    }
    const course = await Course.findById(req.params.id)

    res.render('course-edit', {
        title: `Редактировать ${course.title}`,
        course
    })
})

router.post('/edit',auth, async (req, res)=>{
    const{id} =req.body
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body)
    res.redirect('/courses')
})

router.get('/:id', async (req,res)=>{
    const course = await Course.findById(req.params.id)
    res.render('course', {
        layout: 'empty',
        title: `Курс ${course.title}`,
        course
    })
})


router.post('/', auth, async (req, res)=> {
    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        userId: req.user.id
    })
    try {
        await course.save()
        res.redirect('/courses')
    } catch (e){
        console.log(e)
    }

})

router.post('/remove', auth, async (req,res) =>{
    
    try {
        await Course.deleteOne({
            _id: req.body.id
        })
        res.redirect('/courses')
    } catch (error) {
        console.log(error)
    }
})
module.exports = router