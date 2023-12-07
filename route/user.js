const express = require('express');

const UserController = require('../controller/user');

const route = express.Router();

route.post('/signup',UserController.postUserSignupInfo);
route.post('/login',UserController.checkUserEmail);
route.post('/checkPassword',UserController.checkUserPassword);

module.exports = route ;