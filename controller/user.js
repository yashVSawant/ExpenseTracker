exports.postUserLoginInfo = (req,res,next)=>{
    const body = req.body;
    console.log(body);
    res.json(body);
}