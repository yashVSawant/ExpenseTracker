const Sequelize = require('sequelize');

const sequelize = new Sequelize('expence-tracker','root','Yash1234',{
    dialect:'mysql',
    host:'localhost'
})

module.exports = sequelize ;