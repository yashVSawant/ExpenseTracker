const expence = require('../model/expence');
const sequelize = require('../util/database');

exports.postExpence = async(req,res,next)=>{
    const t = await sequelize.transaction();;
    try{
        const {amount , decription , category} = req.body;
        const previousAmount = req.user.totalExpence;
        // console.log(amount , decription , category , previousAmount);
        await req.user.update({totalExpence:previousAmount + +amount},{transaction:t});
        const getPostExpence = await expence.create({amount,decription,category,UserId:req.user.id},{transaction:t});
        await t.commit();
        res.json(getPostExpence);
    }catch(err){
        await t.rollback();
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
    const t = await sequelize.transaction();
    try{
        const previousAmount = req.user.totalExpence;
        const getExpence = await req.user.getExpences({where:{id:id}})
        const getAmount = getExpence[0].amount
        await getExpence[0].destroy({transaction:t});
        await req.user.update({totalExpence:previousAmount-getAmount},{transaction:t});
        await t.commit();
        res.json({success:true})
    }catch(err){
        await t.rollback();
        console.log(err)
    }
}