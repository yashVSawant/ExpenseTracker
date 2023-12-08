const expence = require('../model/expence');

exports.postExpence = async(req,res,next)=>{
    try{
        const {amount , decription , category} = req.body;
        console.log(amount ,decription ,category);
        const getExpence = await expence.create({amount,decription,category,UserId:req.user.id});
        res.json(getExpence);
    }catch(err){
        res.status(500).json({success:false , message:'error Something went wrong !'})
    }
}

exports.getExpences = async(req,res,next)=>{
    // expence.findAll({where:{userId:req.user.id}});
    try{
        const allexpences = await req.user.getExpences();
        res.json(allexpences);
    }catch(err){
        res.status(500).json({success:false,message:'error Something went wrong !'})
    }
}

exports.deleteExpence = async(req,res,next)=>{
    const id = req.query.id;
    try{
        const getExpence = await expence.findByPk(id);
        getExpence.destroy();
        res.json({success:true})
    }catch(err){
        console.log(err)
    }
}