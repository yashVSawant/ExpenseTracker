const express = require('express');

const UserController = require('../controller/user');

const route = express.Router();

route.post('/signup',UserController.postSignupInfo);
route.post('/login',UserController.checkEmailAndPassword);

module.exports = route ;