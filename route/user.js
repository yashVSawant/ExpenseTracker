const express = require('express');

const UserController = require('../controller/user');

const route = express.Router();

route.post('/signup',UserController.postUserSignupInfo);
route.post('/login',UserController.checkUserEmailAndPassword);

module.exports = route ;