const user = require('../model/user');

exports.postUserLoginInfo = async(req,res,next)=>{
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