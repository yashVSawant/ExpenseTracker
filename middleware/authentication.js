const jwt = require('jsonwebtoken');
const User = require('../model/user');

const authenticate = async(req,res,next)=>{

    try{
        const token = req.header('Authorization')
        const user = jwt.verify(token,'yash')
        console.log('token >>>',user);
        const getUser = await User.findByPk(user.userId);
        req.user = getUser;
        next();
    }catch(err){
        res.status(401).json({success:false,message:'something went wrong in authentication'});
    }
}

module.exports = {authenticate};