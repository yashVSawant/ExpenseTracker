const mongoose = require('mongoose');
const S3Services = require('../services/S3Services');

const User = require('../models/user');
const Expense = require('../models/expense');
const Reports = require('../models/reportUrl');

exports.postExpence = async(req,res,next)=>{
    try{
        const {amount , description , category} = req.body;
        const previousAmount = req.user.totalExpense;
        req.user.totalExpense =previousAmount + +amount;
        const createExpense = new Expense({amount:amount,description:description,category:category,userId:req.user._id});
        await req.user.save();
        await createExpense.save();
        // console.log(createExpense)
        res.status(200).json(createExpense);
    }catch(err){
        res.status(500).json({success:false , message:'error Something went wrong !'})
    }
}

exports.getExpences = async(req,res,next)=>{
    try{
        let {page,limit} = req.query;
        const totalExpense = 10;//req.user.expense.length;
        const totalPage = Math.ceil(totalExpense/limit);
        const offset = totalExpense > page * limit ? totalExpense - page * limit:0;
        if(offset<totalExpense % limit){
            limit = totalExpense % limit;
        }
        const hasNextPage = (offset+limit) < totalExpense
        const hasPreviousPage = page>1 
        const allexpences = (await Expense.find({userId:req.user._id}).limit(limit).skip(0)).reverse();
        const data = {page,totalPage,hasNextPage,hasPreviousPage,totalExpense}
        res.status(200).json({allexpences,data});
    }catch(err){
        console.log(err)
        res.status(500).json({success:false,message:'error Something went wrong !'})
    }
}
exports.getTotalExpense = async(req,res,next)=>{
    const startOfYear = new Date(new Date().getFullYear(),0);
    const totalYearData = await Expense.find({userId:req.user._id , createdAt: { $gte: startOfYear }})

    const totalMonthData = totalYearData.filter((expense)=>{
        const today = new Date()
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return   (expense.createdAt > startOfMonth )
    })
    const totalDay = totalMonthData.filter((expense)=>{
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(),today.getMonth(), today.getDate(), 1);
        return  expense.createdAt > startOfDay
    }).map((item)=>item.amount).reduce((a,b)=>a+b,0);
    const totalYear = totalYearData.map((item)=>item.amount).reduce((a,b)=>a+b,0);
    const totalMonth = totalMonthData.map((item)=>item.amount).reduce((a,b)=>a+b,0);
    res.status(200).json({totalDay,totalMonth,totalYear});
}

exports.deleteExpence = async(req,res,next)=>{
    const id = req.query.id;
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try{
        await Expense.findByIdAndDelete(id);
        // const getExpense = req.user.expense.find((expense)=>expense._id.toString()===id.toString())
        // await User.findOneAndUpdate({ _id: req.user._id },{$pull:{ expense: { _id: id } }},{ new: true });
        // const previousAmount = req.user.totalExpense;
        // const getAmount = getExpense.amount
        // req.user.totalExpense = previousAmount-getAmount;
        // await req.user.save({session})
        // await session.commitTransaction();
        res.status(201).json({success:true})
    }catch(err){
        // await session.abortTransaction();
        console.log(err)
    }
}

exports.updateExpence = async(req,res,next)=>{
    const id = req.query.id;
    const {amount , description , category} = req.body;
    try{
        await Expense.findByIdAndUpdate(id,{amount , description , category})
        res.status(201).json({success:true})
    }catch(err){
        res.status(500).json({success:false})
    }
}

exports.isPremium = (req,res,next)=>{
    const isPremiumUser = req.user.isPremium;
    res.status(200).json({isPremiumUser})
}

exports.getUrl = async(req,res,next)=>{
    try{
        const reports = await Reports.find({userId:req.user._id}).limit(5);
        res.status(200).json({success:true,reports})
    }catch(err){
        res.status(404).json({success:false})
    }
}

exports.downloadExpense = async(req,res,next)=>{
    try{
        const userId = req.user._id;
        const getUserExpences = await Expense.findById(userId);
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

