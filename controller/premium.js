const Sequelize = require('sequelize');
const expence = require('../model/expence');
const user = require('../model/user')
const order = require('../model/order');
const sequelize = require('../util/database');

exports.getLeaderboard = async(req,res)=>{
    try{
      const allUsers = await user.findAll({
        attributes:['id','name','totalExpence'],
        order:[['totalExpence', 'DESC']],
      })
      res.status(200).json(allUsers);
    }catch(err){
        res.status(404).json({success:false,error:err})
    }
}

exports.getUserData = (req,res)=>{
  
}