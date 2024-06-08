const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req,res,next)=>{
    const {name,email,password,isPremium} = req.body;
        if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err:'bad parameter : somthing went wrong'})
        }
        const saltRound = 10;
        bcrypt.hash(password,saltRound,async(err,hash)=>{
            try{
                const user = new User({name:name,email:email,password:hash,isPremium:isPremium,totalExpense:0})
                 user.save();
                res.status(201).send('User signup successfully');
            }catch(err){
                res.status(403).send('email already exist');
            }  
        })
}

exports.login = async(req,res,next)=>{
    const {email,password} = req.body;
    try{
        if(isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err:'bad parameter : somthing went wrong'})
        }
        const checkUser = await User.find({'email':email});
        if(checkUser){
            bcrypt.compare(password,checkUser[0].password,(err,result)=>{
                if(err){
                    res.status(500).json({success:false ,message:'something went wrong !'})                   
                }
                else if(result){
                    res.status(201).json({success:true ,message:'User login succesfull',token:generateAccessToken(checkUser[0]._id,checkUser[0].name,checkUser[0].isPremium)})
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

function generateAccessToken(id,name,isPremium){
    return jwt.sign({userId:id , name:name ,isPremium:isPremium},process.env.TOKEN);
}