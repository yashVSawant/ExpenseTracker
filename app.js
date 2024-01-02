const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

const sequelize = require('./util/database');
const userRoute = require('./route/user');
const expenceRoute = require('./route/expence');
const authenticateRoute = require('./route/purchase');
const premiumRoute = require('./route/premium');
const passwordRoute = require('./route/password');

const expence = require('./model/expence');
const user = require('./model/user');
const order = require('./model/order');
const resetPasswordRequest = require('./model/FPRequest');
const reportUrl = require('./model/reportUrl');

const accessLogStrem = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flages:'a'}
);

user.hasMany(expence);
expence.belongsTo(user);

user.hasMany(order);
order.belongsTo(user);

user.hasMany(resetPasswordRequest);
resetPasswordRequest.belongsTo(user);

user.hasMany(reportUrl);
reportUrl.belongsTo(user);

app.use(helmet({
    contentSecurityPolicy: false,
  }));
  
app.use(morgan('combined',{stream: accessLogStrem}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({origin:'*'}));
app.use(express.static('frontend'));

app.use('/user',userRoute);
app.use('/expence',expenceRoute);
app.use('/purchase',authenticateRoute);
app.use('/premium',premiumRoute);
app.use('/password',passwordRoute);
app.use((req,res)=>{
    console.log(req.url);
    res.sendFile(path.join(__dirname,`frontend/${req.url}`))
})

app.use((req,res,next)=>{
    res.status(404).send('Error: 404');
})

sequelize
.sync()
.then(()=>{
    app.listen(3000);
})
.catch(err=>console.log(err));
