const express = require('express');

const route = express.Router();

const controller = require('../controller/premium')

route.get('/getLeaderboard',controller.getLeaderboard);

module.exports = route;