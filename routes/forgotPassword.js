const express = require('express');

const route = express.Router();

const controllerForgotPassword = require('../controllers/forgotPassword');

route.post('/forgotPassword',controllerForgotPassword.forgotPassword);

route.get('/resetPassword/:id',controllerForgotPassword.resetPasswordLink);

route.post('/setNewPassword',controllerForgotPassword.setNewPassword);

module.exports = route;