const Razorpay = require('razorpay');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const Order = require('../models/order');
const purchasePremium = async (req,res)=>{
    try{
        // console.log('in>>>',process.env.RAZORPAY_KEY_ID)
        var rzp = new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 5500;
        // console.log(amount);
        rzp.orders.create({amount,currency:'INR'},(err ,order)=>{
                if(err){
                    console.log(err)
                    throw new Error(JSON.stringify(err))
                }
                const createOrder = new Order({orderId:order.id ,status:'pending ,',userId:req.user._id})
                // req.user.order.orderId=order.id;
                // req.user.order.status='pending';
                // req.user.save()
                // .then(()=>{
                createOrder.save();
                return res.status(201).json({order ,key_id : rzp.key_id})
                // })
                // .catch((err)=>{
                //     console.log(err)
                //     throw new Error(err)
                // })
            })      
        
    }catch(err){
        console.log(err)
        res.status(400).json({success:false,message:'something went wrong in purchase!'})
    }
}
const updatePremium = async(req,res)=>{
    try{
        
        const {order_id,payment_id,status,isPremium} = req.body;
        
        await Order.findOneAndUpdate({orderId:order_id},{status:status},{paymentId:payment_id})
        req.user.isPremium = isPremium;
        await req.user.save();
        res.status(200).json({success:true ,token:generateAccessToken(req.user._id,req.user.name,req.user.isPremium)})
    }catch(err){
        console.log(err)
        res.status(500).json({success:false,message:'something went wrong in updatePremium!'})
    }
}

function generateAccessToken(id,name,isPremium){
    return jwt.sign({userId:id , name:name ,isPremium:isPremium},process.env.TOKEN);
}

module.exports = {purchasePremium,updatePremium};