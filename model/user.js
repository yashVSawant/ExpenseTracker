const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const user = sequelize.define('User',{
    name:Sequelize.STRING,
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:Sequelize.STRING,
    isPremium:Sequelize.BOOLEAN,
});

module.exports = user;