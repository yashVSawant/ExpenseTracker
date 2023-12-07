const user = require('../model/user');

exports.postUserSignupInfo = async(req,res,next)=>{
    const userDetails = req.body;
    console.log(userDetails);
    try{
        const postUser = await user.create(userDetails);
        res.json(postUser);
    }catch(err){
        // console.log(err)
        res.json(err);
    }
}

exports.checkUserEmail = async(req,res,next)=>{
    const email = req.body.email;
    try{
        const checkUser = await user.findOne({where:{email:email}});
        res.send(checkUser);
        
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
        res.json(checkPassword);
    }catch(err){
        res.json(err);
    }
}