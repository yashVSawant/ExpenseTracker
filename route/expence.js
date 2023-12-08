const express = require('express');
const path = require('path');

const route = express.Router();

const expenceController = require('../controller/expence');

route.get('/expencePage',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'..','frontend','html','expence.html'));
})
route.get('/getExpences',expenceController.getExpences);
route.post('/postExpence',expenceController.postExpence);
route.delete('/deleteExpence',expenceController.deleteExpence);

module.exports = route;