const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const reportUrl = sequelize.define('reportUrl',{
    url:Sequelize.TEXT
});

module.exports = reportUrl;