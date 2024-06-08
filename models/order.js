const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema;
const order = new Schema({
    paymentId:{type:Schema.Types.String},
    orderId:{type:Schema.Types.String},
    status:{type:Schema.Types.String},
    userId :{ type: Schema.Types.ObjectId, ref: 'user' }
});

module.exports = mongoose.model('order',order)