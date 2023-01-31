const express = require('express');

const app = express();

const bodyparser = require('body-parser');

const mongoose = require('mongoose');

const bcrypt = require('bcrypt')

const env = require('dotenv');

env.config();

const ejs = require('ejs');

const task = require('./models/task');

const user = require('./models/user')

const {user_validation,login} = require('./validations/user_validation')

const {task_validation} = require('./validations/task')

var user_email;

app.set('view engine','ejs');

app.use(express.static('public'))

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({extended:false}));

mongoose.connect(process.env.DB_CONNECT,console.log("Connected to Db"))

app.post('/register',async (req,res)=>{
    const {error,value} = user_validation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const data = await user.findOne({email:req.body.email})
    if(data) return res.status(400).send("Account Already Exists")

    const salt = await bcrypt.genSalt(10)
    const hashedpass = await bcrypt.hash(req.body.password,salt)

    const post = new user({
        name:req.body.name,
        email:req.body.email,
        password:hashedpass
    })

    try {
        await post.save()
        app.set('email',req.body.email)
        user_email = req.body.email
        res.redirect(`/tasks/${user_email}`)
    } catch (error) {
        res.send(error)
    }
})

app.post('/login',async (req,res)=>{
    const {error,value} = login(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const dataemail = req.body.email
    const data = await user.findOne({email:dataemail})
    if(!data) return res.status(400).send("Account Doesn't Exist")

    const validpass = await bcrypt.compare(req.body.password,data.password)
    if(!validpass) return res.status(400).send("Invalid Password")
    
    user_email = req.body.email

    // app.set('email',req.body.email)
    res.redirect(`/tasks/${user_email}`)
})

app.get('/tasks/:email',async (req,res)=>{
    const tasks = await task.find({email:req.params.email}).sort({status:-1})
    res.render('main',{details:tasks})
})


app.post('/add-task',async (req,res)=>{

    const {error,value} = task_validation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const obj = new task({
        email:user_email,
        task:req.body.task,
        priority:req.body.priority,
        date:req.body.date
    })

    try {
        await obj.save()
        const tasks = await task.find({email:obj.email}).sort({status:-1})
        res.render('main',{details:tasks})
    } catch (error) {
        res.send(error)
    }
})

app.get('/delete-task/:id',async (req,res)=>{
    const id = req.params.id
    await task.findByIdAndUpdate(id,{$set :{status:"deleted"}},{new:true})
    // const email = app.get('email')
    const tasks = await task.find({email:user_email}).sort({status:-1})
    // app.set('email',email)
    res.render('main',{details:tasks})
})

app.get('/complete-task/:id',async (req,res)=>{
    const id = req.params.id
    await task.findOneAndUpdate({_id:id},{$set : {status:'completed'}},{new:true})
    // const email = app.get('email')
    const tasks = await task.find({email:user_email}).sort({status:-1})
    console.log(tasks);
    // app.set('email',email)
    res.render('main',{details:tasks})
})

app.get('/cancel-task/:id',async (req,res)=>{
    const id = req.params.id
    await task.findByIdAndUpdate(id,{$set :{status:"cancelled"}},{new:true})
    // const email = app.get('email')
    const tasks = await task.find({email:user_email}).sort({status:-1})
    // app.set('email',email)
    res.render('main',{details:tasks})
})

app.get('/',(req,res)=>{
    res.sendFile('./public/index.html')
})

app.listen(3000||process.env.PORT,console.log("Server Running"))