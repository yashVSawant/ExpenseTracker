const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const order = sequelize.define('Order',{
    paymentId:Sequelize.STRING,
    orderId:Sequelize.STRING,
    status:Sequelize.STRING
});

module.exports = order;