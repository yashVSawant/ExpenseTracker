const user = require('../model/user');

exports.postUserSignupInfo = async(req,res,next)=>{
    const userDetails = req.body;
    console.log(userDetails);
    try{
        const postUser = await user.create(userDetails);
        res.send('User signup successfully');
    }catch(err){
        // console.log(err)
        res.status(403).send('email already exist');
    }
}

exports.checkUserEmail = async(req,res,next)=>{
    const email = req.body.email;
    try{
        const checkUser = await user.findOne({where:{email:email}});
        if(checkUser)res.send('valid user')
        else res.status(404).send('User not found')
        
    }catch(err){
        // console.log(err)
        res.json(err);
    }
}

exports.checkUserPassword = async(req,res,next)=>{
    const password = req.body.password;
    const email = req.body.email;
    try{
        const checkPassword = await user.findOne({where:{email:email,password:password}})
        if(checkPassword)res.send('User login succesfull')
        else res.status(401).send('User not authorized')
    }catch(err){
        res.json(err);
    }
}