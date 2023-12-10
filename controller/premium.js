const Sequelize = require('sequelize');
const expence = require('../model/expence');
const user = require('../model/user')
const order = require('../model/order');

exports.getLeaderboard = async(req,res)=>{
    try{
      const ris = await user.findAll({
        attributes: [
          'id','name'
        ]
      });
      
      console.log('result>>>',ris);

        const result = await expence.findAll({
            attributes: [
              'userId',
              [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalExpense'],
            ],
            group: ['userId'],
            order: [[Sequelize.literal('totalExpense'), 'DESC']],
          });
          res.json(result)
    }catch(err){
        res.status(404).json({success:false})
    }
}

exports.getUserName = async(req,res)=>{
    const id = req.query.id;
    const getUser = await user.findByPk(id);
    res.send(getUser.name);
}