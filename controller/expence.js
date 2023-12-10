const expence = require('../model/expence');

exports.postExpence = async(req,res,next)=>{
    try{
        const {amount , decription , category} = req.body;
        const previousAmount = req.user.totalExpence;
        console.log(amount , decription , category , previousAmount);
        await req.user.update({totalExpence:previousAmount + +amount});
        const getPostExpence = await expence.create({amount,decription,category,UserId:req.user.id});
        res.json(getPostExpence);
    }catch(err){
        res.status(500).json({success:false , message:'error Something went wrong !'})
    }
}

exports.getExpences = async(req,res,next)=>{
    try{
        const isPremium = req.user.isPremium
        const allexpences = await req.user.getExpences();
        res.json({allexpences,isPremium});
    }catch(err){
        res.status(500).json({success:false,message:'error Something went wrong !'})
    }
}

exports.deleteExpence = async(req,res,next)=>{
    const id = req.query.id;
    try{
        const previousAmount = req.user.totalExpence ||0;
        const getExpence = await req.user.getExpences({where:{id:id}})
        // console.log( previousAmount,getExpence[0].amount);
        await req.user.update({totalExpence:+previousAmount-getExpence[0].amount});
        getExpence[0].destroy();
        res.json({success:true})
    }catch(err){
        console.log(err)
    }
}