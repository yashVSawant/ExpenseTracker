const user = require('../model/user')


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
