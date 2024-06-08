const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema;
const resetPassword = new Schema({
    _id:{type:Schema.Types.UUID,default:uuidv4,unique:true},
    isActive:{type:Schema.Types.Boolean},
    userId :{ type: Schema.Types.ObjectId, ref: 'user' }
});

module.exports = mongoose.model('resetPassword',resetPassword)