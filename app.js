const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const sequelize = require('./util/database');
const userRoute = require('./route/user');
const expenceRoute = require('./route/expence');
const expence = require('./model/expence');
const user = require('./model/user');

user.hasMany(expence);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(express.static('frontend'));

app.use('/user',userRoute);
app.use('/expence',expenceRoute);

app.use((req,res,next)=>{
    res.status(404).send('Error: 404');
})

sequelize
.sync()
.then(()=>{
    app.listen(3000);
})
.catch(err=>console.log(err));
