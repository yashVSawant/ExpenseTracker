const express = require('express');

const route = express.Router();

const controller = require('../controller/premium')
const authentication = require('../middleware/authentication')

route.get('/getLeaderboard',controller.getLeaderboard);
route.get('/getUserData',authentication.authenticate,controller.getUserData)

module.exports = route;