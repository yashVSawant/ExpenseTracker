const Razorpay = require('razorpay');
require('dotenv').config();

const Order = require('../model/order');

const purchasePremium = async (req,res)=>{
    try{
        // console.log('in>>>',process.env.RAZORPAY_KEY_ID)
        var rzp = new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;
        // console.log(amount);
        rzp.orders.create({amount,currency:'INR'},(err ,order)=>{
            if(err){
                throw new Error(JSON.stringify(err))
            }
            req.user.createOrder({orderId:order.id , status:'pending'})
            .then(()=>{
                return res.status(201).json({order ,key_id : rzp.key_id})
            }).catch(err=>{
                throw new Error(err)
            })
        })         
        
    }catch(err){
        res.status(400).json({success:false,message:'something went wrong in purchase!'})
    }
}
const updatePremium = async(req,res)=>{
    try{
        const gotOrder = await req.user.getOrders({where:{orderId:req.body.order_id}});
        const upateOrder = await gotOrder[0].update({paymentId:req.body.payment_id,status:req.body.status});
        const updateUser = await req.user.update({isPremium:req.body.isPremium})
        await Promise.all([upateOrder,updateUser]);
        res.status(200).json({success:true})
    }catch(err){
        res.status(400).json({success:false,message:'something went wrong in updatePremium!'})
    }
}

module.exports = {purchasePremium,updatePremium};