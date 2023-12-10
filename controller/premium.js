const Sequelize = require('sequelize');
const expence = require('../model/expence');
const user = require('../model/user')
const order = require('../model/order');
const sequelize = require('../util/database');

exports.getLeaderboard = async(req,res)=>{
    try{
      const users = await user.findAll({
        attributes:['id','name',[sequelize.fn('sum',sequelize.col('amount')),'totalCost']],
        include:[
          {
            model:expence,
            attributes:[]
          }
        ],
        group:['user.id'],
        order:[[Sequelize.literal('totalCost'), 'DESC']],
      });
      res.status(200).json(users);
    }catch(err){
        res.status(404).json({success:false,error:err})
    }
}

// exports.getUserName = async(req,res)=>{
//     const id = req.query.id;
//     const getUser = await user.findByPk(id);
//     res.send(getUser.name);
// }