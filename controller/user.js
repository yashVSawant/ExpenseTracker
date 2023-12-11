const user = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postSignupInfo = (req,res,next)=>{
    const {name,email,password,isPremium} = req.body;
        if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err:'bad parameter : somthing went wrong'})
        }
        const saltRound = 10;
        bcrypt.hash(password,saltRound,async(err,hash)=>{
            console.log('error from user.controller>>>',err);
            try{
                await user.create({
                    name,
                    email,
                    password:hash,
                    isPremium,
                    totalExpence:0
                });
                res.status(201).send('User signup successfully');
            }catch(err){
                res.status(403).send('email already exist');
            }  
        })
}

exports.checkEmailAndPassword = async(req,res,next)=>{
    const {email,password} = req.body;
    try{
        if(isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err:'bad parameter : somthing went wrong'})
        }
        const checkUser = await user.findOne({where:{email:email}});
        if(checkUser){
            bcrypt.compare(password,checkUser.password,(err,result)=>{
                if(err){
                    res.status(500).json({success:false ,message:'something went wrong !'})                   
                }
                if(result){
                    res.status(201).json({success:true ,message:'User login succesfull',token:generateAccessToken(checkUser.id,checkUser.name,checkUser.isPremium)})
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
    return jwt.sign({userId:id , name:name ,isPremium:isPremium},'yash');
}