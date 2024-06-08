const User = require('../models/user')


exports.getLeaderboard = async(req,res)=>{
    try{
          const allUsers = await User.find()
          .select('name totalExpense')
          .sort({'totalExpense':-1})
          .limit(10)
          res.status(200).json(allUsers); 
    }catch(err){
        console.log(err)
        res.status(404).json({success:false,error:err})
    }
}
