const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async(req,res,next)=>{
    try{
        const {name,email,password,isPremium} = req.body;
        if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err:'bad parameter : somthing went wrong'})
        }
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password , salt);
        const user = new User({name:name,email:email,password:hash,isPremium:isPremium,totalExpense:0})
        await user.save();
        res.status(201).send('User signup successfully');
    }catch(err){
         res.status(403).send('email already exist');
    } 
}

exports.login = async(req,res,next)=>{
    const {email,password} = req.body;
    try{
        if(isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err:'bad parameter : somthing went wrong'})
        }
        const checkUser = await User.findOne({'email':email});
        if(checkUser){
            bcrypt.compare(password,checkUser.password,(err,result)=>{
                if(err){
                    return res.status(500).json({success:false ,message:'something went wrong !'})                   
                }
                else if(result){
                    res.status(201).json({success:true ,message:'User login succesfull',token:generateAccessToken(checkUser._id,checkUser.name,checkUser.isPremium, checkUser.email)})
                }else{
                    res.status(401).json({success:false ,message:'incorrect password !'})
                }
            })
        }
        else res.status(404).json({success:false ,message:'User not found'})
        
    }catch(err){
        // console.log(err)
        res.status(500).json({success:false,message:err});
    }
}

function isstringinvalid(getString){
   return getString === ''?true:false;
}

function generateAccessToken(id,name,isPremium ,email){
    return jwt.sign({userId:id , name:name ,isPremium:isPremium ,email:email},process.env.TOKEN);
}