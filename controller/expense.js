const Expense = require('../model/expense');
const User = require('../model/user');
const reportUrl = require('../model/reportUrl');
const mongoose = require('mongoose');
const userServices = require('../services/userExpences');
const S3Services = require('../services/S3Services');

exports.postExpence = async(req,res,next)=>{
    try{
        const {amount , decription , category} = req.body;
        const previousAmount = req.user.totalExpense;
        req.user.totalExpense =previousAmount + +amount;
        const newExpense = req.user.expense.push({amount:amount,description:decription,category:category});
        await req.user.save();
        res.json(newExpense);
    }catch(err){
        res.status(200).status(500).json({success:false , message:'error Something went wrong !'})
    }
}

exports.getExpences = async(req,res,next)=>{
    try{
        const currentPage = req.query.page;
        const limit = +req.query.limit;
        const offset = (currentPage-1)* limit ;
        const totalExpense = req.user.expense.length;
        const hasNextPage = (offset+limit) < totalExpense
        const hasPreviousPage = currentPage>1 
        const totalPage = Math.ceil(totalExpense/limit);
        const allexpences = req.user.expense.splice(offset,limit);
        const data = {currentPage,totalPage,hasNextPage,hasPreviousPage,totalExpense}
        res.status(200).json({allexpences,data});
    }catch(err){
        console.log(err)
        res.status(500).json({success:false,message:'error Something went wrong !'})
    }
}

exports.deleteExpence = async(req,res,next)=>{
    const id = req.query.id;
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const getExpense = req.user.expense.find((expense)=>expense._id.toString()===id.toString())
        await User.findOneAndUpdate({ _id: req.user._id },{$pull:{ expense: { _id: id } }},{ new: true });
        const previousAmount = req.user.totalExpense;
        const getAmount = getExpense.amount
        req.user.totalExpense = previousAmount-getAmount;
        await req.user.save({session})
        await session.commitTransaction();
        res.status(201).json({success:true})
    }catch(err){
        await session.abortTransaction();
        console.log(err)
    }
}

exports.isPremium = (req,res,next)=>{
    const isPremiumUser = req.user.isPremium;
    res.status(200).json({isPremiumUser})
}

exports.getUrl = async(req,res,next)=>{
    try{
        const reports = await req.user.reportUrl;
        res.status(200).json({success:true,reports})
    }catch(err){
        res.status(404).json({success:false})
    }
}

exports.downloadExpense = async(req,res,next)=>{
    try{
        const userId = req.user.id;
        const getUserExpences = req.user.expense;
        const stringifiedExpenses = JSON.stringify(getUserExpences);
        const filename = `expense${userId}/${new Date()}.txt`;
        const fileUrl = await S3Services.uploadToS3(stringifiedExpenses,filename);
        req.user.reportUrl.push({url:fileUrl})
        req.user.save();
        res.status(200).json({fileUrl , success:true})
    }catch(err){
        console.log(err)
        res.status(500).json({fileUrl:'' , success:false})
    }
   
}

