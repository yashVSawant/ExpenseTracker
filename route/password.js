const express = require('express');

const route = express.Router();

const controllerForgotPassword = require('../controller/forgotPassword');

route.get('/forgotPassword',controllerForgotPassword.forgotPassword);

module.exports = route;