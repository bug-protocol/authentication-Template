const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
mongoose.connect('mongodb://localhost:27017/demoauth',{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>{
        console.log("MongoDB connected successfully!!");
    })
    .catch((err)=>{
        console.log("Error in connecting to MongoDB!!",err);
    }   
)
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:'itisaninterestingsecret',
    resave: false,
    saveUninitialized: false
}));
app.set('view engine','ejs');
app.set('views','views');
app.listen(4400,()=>{
    console.log("Server has been started!!");
})

app.get('/',(req,res)=>{
    res.send("Home!");
})
app.get('/secret',(req,res)=>{
    if(!req.session.user_id)
        res.redirect('/login');
    else
        res.send("Try again");
})

app.get('/register',(req,res)=>{
    res.render('register');
})
app.post('/register',async(req,res)=>{
    const {username,password} = req.body;
    const hash = await bcrypt.hash(password,10);
    const user = new User({
        username: username,
        password: hash
    })
    console.log(user);
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/secret');
})
app.get('/login',(req,res)=>{
    res.render('login');
})
app.post('/login',async(req,res)=>{
    const{username,password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        return res.redirect('/register');
    }
    const matching = await bcrypt.compare(password,user.password);
    if(matching){
        req.session.user_id = user._id;
        res.redirect('/secret');
    }
    else{
        res.redirect("/login");
    }
})