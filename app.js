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
const userRoute = require('./route/user');
const expenceRoute = require('./route/expense');
const authenticateRoute = require('./route/purchase');
const premiumRoute = require('./route/premium');
const passwordRoute = require('./route/forgotPassword');

const accessLogStrem = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags:'a'}
);

app.use(helmet({
    contentSecurityPolicy: false,
  }));
  
app.use(morgan('combined',{stream: accessLogStrem}))
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
    console.log(req.url);
    res.sendFile(path.join(__dirname,`views/${req.url}`))
})

app.use((req,res,next)=>{
    res.status(404).send('Error: 404');
})


mongoose.connect('mongodb+srv://yash:0H5MGRs1p5S68cVo@cluster0.y35knxu.mongodb.net/expenseTracker?retryWrites=true&w=majority')
.then(()=>{
    console.log('conntected');
    app.listen(3000);
})
.catch(err=>console.log(err));