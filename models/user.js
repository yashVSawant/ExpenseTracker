const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{type:Schema.Types.String,require:true},
    email:{type:Schema.Types.String,require:true},
    password:{type:Schema.Types.String,require:true},
    isPremium:{type:Schema.Types.Boolean,require:true},
    totalExpense:{type:Schema.Types.Number,require:true}
})

module.exports = mongoose.model('user',userSchema);



