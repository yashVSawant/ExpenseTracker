const path = require('path');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const Sib = require('sib-api-v3-sdk');
const mongoose = require('mongoose')
let client = Sib.ApiClient.instance;
require('dotenv').config();

exports.forgotPassword =async (req,res,next)=>{
    const userMail = req.body.email;
    console.log('>>.3',userMail)
    let apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.SIB_API_KEY;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
        email:process.env.EMAIL
    }
    const receivers =[
        {email:userMail},
    ]
    console.log('>>.2')
    try{
        const requestUser = await User.findOne({'email':userMail})
        if(!requestUser) throw new Error(JSON.stringify(err));
        requestUser.resetPassword.isActive = true;
        await requestUser.save();
        await tranEmailApi.sendTransacEmail({
            sender,
            to:receivers,
            subject:'reset password link',
            textContent:`
            checking msg http://184.73.124.55:3000/password/resetpassword/${requestUser.resetPassword._id}
            `
            
        })
        res.status(200).send('forgotPassword')
    }catch(err){
        console.log(err)
        res.status(400).json({success:false,error:err})
    }
}

exports.resetPasswordLink = async(req,res,next)=>{
    const id = req.params.id;
    try{
        const userRequest = await User.findOne({'resetPassword._id':id});
        if(userRequest && userRequest.resetPassword.isActive){
            res.sendFile(path.join(__dirname,'..','frontend','html','resetPassword.html'))
        }else{
            res.status(404).send('no request found')
        }
    }catch(err){
        console.log(err);
        res.status(404).send('something went wrong!');
    }
}

exports.setNewPassword = async(req,res)=>{
    const newPassword = req.body.password;
    const id = req.body.id;
    try{
        const userRequest = await User.findOne({'resetPassword._id':id});
        if(userRequest && userRequest.resetPassword.isActive){
            console.log(userRequest,newPassword)
            const saltRound = 10;
            bcrypt.hash(newPassword,saltRound,async(err,hash)=>{
                console.log('error from user.controller>>>',err);
                try{
                    userRequest.password = hash;
                    userRequest.resetPassword.isActive = false;
                    userRequest.save();
                    res.status(201).send('password updated successfully');
                }catch(err){
                    res.status(403).send('something went wrong!');
                }  
            })
        }
    }catch(err){
        console.log(err)
        res.status(403).send('something went wrong!');
    }
   
}