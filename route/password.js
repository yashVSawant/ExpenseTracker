const express = require('express');

const route = express.Router();

const authentication = require('../middleware/authentication');
const controllerForgotPassword = require('../controller/forgotPassword');

route.post('/forgotPassword',controllerForgotPassword.forgotPassword);

route.get('/resetPassword/:id',controllerForgotPassword.resetPassword);

route.post('/setNewPassword',controllerForgotPassword.setNewPassword);

module.exports = route;