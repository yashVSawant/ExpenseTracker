const express = require('express');

const UserController = require('../controllers/user');

const route = express.Router();

route.post('/signup',UserController.signup);
route.post('/login',UserController.login);

module.exports = route ;