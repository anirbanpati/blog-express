const express = require('express');
const dotenv = require('dotenv').config();
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8000;
const {checkForAuthentication} = require('./middlewares/authentication');
const Blog = require('./models/blog');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');   


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(checkForAuthentication('token'));

app.use(express.static(path.join(__dirname, 'public')));



mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log('Database connected');
})
.catch((err)=>{
    console.log(err);
})


const userRouter = require('./routes/user');
const blogRouter = require('./routes/blog');




app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/',async(req,res)=>{
    const allBlogs = await Blog.find({});

    res.render('home',{
        user: req.user,
        blogs: allBlogs
    });
})

app.use('/user',userRouter);
app.use('/blog',blogRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})




