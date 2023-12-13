const expence = require('../model/expence');
const reportUrl = require('../model/reportUrl');
const sequelize = require('../util/database');
const userServices = require('../services/userExpences');
const S3Services = require('../services/S3Services');

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
        const currentPage = req.query.page;
        const limit = +req.query.limit;
        // console.log('limit&page',limit , currentPage)
        const offset = (currentPage-1)* limit ;
        const totalExpenses = await req.user.countExpences();
        const hasNextPage = (offset+limit) < totalExpenses 
        const hasPreviousPage = currentPage>1 
        const totalPage = Math.ceil(totalExpenses/limit);
        // console.log('totalPage',totalPage);
        const allexpences = await req.user.getExpences({limit: limit,offset:offset});
        const data = {currentPage,totalPage,hasNextPage,hasPreviousPage,totalExpenses}
        res.json({allexpences,data});
    }catch(err){
        console.log(err)
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

exports.isPremium = (req,res,next)=>{
    const isPremiumUser = req.user.isPremium;
    res.status(200).json({isPremiumUser})
}

exports.getUrl = async(req,res,next)=>{
    try{
        const reports = await req.user.getReportUrls({attributes:['createdAt','url','id']});
        res.status(200).json({success:true,reports})
    }catch(err){
        res.status(404).json({success:false})
    }
}

exports.downloadExpense = async(req,res,next)=>{
    try{
        const userId = req.user.id;
        const getUserExpences = await userServices.userExpences(req);
        const stringifiedExpenses = JSON.stringify(getUserExpences);
        const filename = `expense${userId}/${new Date()}.txt`;
        const fileUrl = await S3Services.uploadToS3(stringifiedExpenses,filename);
        reportUrl.create({url:fileUrl,UserId:req.user.id});
        res.status(200).json({fileUrl , success:true})
    }catch(err){
        console.log(err)
        res.status(500).json({fileUrl:'' , success:false})
    }
   
}

