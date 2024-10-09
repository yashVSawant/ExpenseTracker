const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const authenticate = async(req,res,next)=>{

    try{
        const token = req.header('Authorization')
        const user = jwt.verify(token,process.env.TOKEN);
        req.user = user;
        next();
    }catch(err){
        res.status(401).json({success:false,message:'something went wrong in authentication'});
    }
}

module.exports = {authenticate};