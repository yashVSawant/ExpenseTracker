const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const sequelize = require('./util/database');
const userRoute = require('./route/user');

app.use(bodyParser.json());
app.use(cors());

app.use('/user',userRoute);
app.use((req,res,next)=>{
    res.status(404).send('Error: 404');
})

sequelize
.sync()
.then(()=>{
    app.listen(3000);
})
.catch(err=>console.log(err));
