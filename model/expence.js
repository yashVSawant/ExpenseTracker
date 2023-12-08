const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const expence = sequelize.define('Expence',{
    amount:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    decription:Sequelize.STRING,
    category:{
        type:Sequelize.STRING,
        allownull:false
    }
});

module.exports = expence;