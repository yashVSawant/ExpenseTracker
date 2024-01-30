const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{type:Schema.Types.String,require:true},
    email:{type:Schema.Types.String,require:true},
    password:{type:Schema.Types.String,require:true},
    isPremium:{type:Schema.Types.Boolean,require:true},
    totalExpense:{type:Schema.Types.Number,require:true},
    expense:[{
        amount:{type:Schema.Types.Number,require:true},
        description:{type:Schema.Types.String,require:true},
        category:{type:Schema.Types.String,require:true}
    }],
    reportUrl:[{
        url:{type:Schema.Types.String,require:true}
    }],
    order:{
        paymentId:{type:Schema.Types.String},
        orderId:{type:Schema.Types.String},
        status:{type:Schema.Types.String}
    },
    resetPassword:{
        _id:{type:Schema.Types.UUID,default:uuidv4,unique:true},
        isActive:{type:Schema.Types.Boolean}
    }
})

module.exports = mongoose.model('user',userSchema);



// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const user = sequelize.define('User',{
//     name:Sequelize.STRING,
//     email:{
//         type:Sequelize.STRING,
//         allowNull:false,
//         unique:true
//     },
//     password:Sequelize.STRING,
//     isPremium:Sequelize.BOOLEAN,
//     totalExpence:Sequelize.INTEGER
// });

// module.exports = user;