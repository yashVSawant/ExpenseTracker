const express = require('express');

const UserController = require('../controller/user');

const route = express.Router();

route.post('/login',UserController.postUserLoginInfo);

module.exports = route ;