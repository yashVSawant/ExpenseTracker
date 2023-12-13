const expence = require('../model/expence');
const sequelize = require('../util/database');
const AWS = require('aws-sdk');

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

exports.isPremium = (req,res,next)=>{
    const isPremiumUser = req.user.isPremium;
    res.status(200).json({isPremiumUser})
}

exports.downloadExpense = async(req,res,next)=>{
    try{
        const userId = req.user.id;
        const getUserExpences = await req.user.getExpences();
        const stringifiedExpenses = JSON.stringify(getUserExpences);
        const filename = `expense${userId}/${new Date()}.txt`;
        const fileUrl = await uploadToS3(stringifiedExpenses,filename);
        console.log(new Date())
        res.status(200).json({fileUrl , success:true})
    }catch(err){
        res.status(500).json({fileUrl:'' , success:false})
    }
   
}

function uploadToS3(data , filename){
    const BUCKET_NAME = 'expencetracker310';
    const IAM_USER_KEY = 'AKIAVOLWZS3FGDC5YOEW';
    const IAM_USER_SECRET = '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';

    let s3bucket = new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET
    })

    
        var param ={
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read'
        }

        return new Promise((resolve,reject)=>{
            s3bucket.upload(param ,(err,s3response)=>{
                if(err){
                    console.log("somthing went wrong ",err)
                    reject(err)
                }else{
                    console.log('success');
                    resolve(s3response.Location);
                }
            })
        })
        

}