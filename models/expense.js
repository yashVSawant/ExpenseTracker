const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const expenseSchema = new Schema({
    amount:{type:Schema.Types.Number,require:true},
    description:{type:Schema.Types.String,require:true},
    category:{type:Schema.Types.String,require:true},
    createdAt: {type:Date,default: Date.now},
    userId :{ type: Schema.Types.ObjectId, ref: 'user' }
});

module.exports = mongoose.model('expense',expenseSchema)