const express = require('express');

const route = express.Router();

const controller = require('../controller/premium')

route.get('/getLeaderboard',controller.getLeaderboard);
// route.get('/getUserName',controller.getUserName)

module.exports = route;