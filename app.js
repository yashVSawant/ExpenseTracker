const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const expenceRoute = require('./routes/expense');
const authenticateRoute = require('./routes/purchase');
const premiumRoute = require('./routes/premium');
const passwordRoute = require('./routes/forgotPassword');

// const accessLogStream = fs.createWriteStream(
//     path.join(__dirname,'access.log'),
//     {flags:'a'}
// );

app.use(helmet({
    contentSecurityPolicy: false,
  }));
  
// app.use(morgan('combined',{stream: accessLogStream}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({origin:'*'}));
app.use(express.static('views'));

app.use('/user',userRoute);
app.use('/expence',expenceRoute);
app.use('/purchase',authenticateRoute);
app.use('/premium',premiumRoute);
app.use('/password',passwordRoute);
app.use((req,res)=>{
    // console.log(req.url);
    res.sendFile(path.join(__dirname,`views/${req.url}`))
})

app.use((req,res,next)=>{
    res.status(404).send('Error: 404');
})


mongoose.connect('mongodb+srv://yashsawant310:XtPFJIFySyCOtjZm@cluster0.hp8gwv4.mongodb.net/expenseTracker?retryWrites=true&w=majority')
.then(()=>{
    console.log('conntected');
    app.listen(process.env.PORT||3000);
})
.catch(err=>console.log(err));