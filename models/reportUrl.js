const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema;
const reportUrl = new Schema({
    url:{type:Schema.Types.String,require:true},
    createdAt: {type:Date,default: Date.now},
    userId :{ type: Schema.Types.ObjectId, ref: 'user' }
});

module.exports = mongoose.model('reportUrl',reportUrl)