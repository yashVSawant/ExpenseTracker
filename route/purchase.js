const express = require('express');

const controller = require('../controller/purchase');
const authentication = require('../middleware/authentication');

const route = express.Router();

route.get('/premiumMembership',authentication.authenticate,controller.purchasePremium)
route.post('/updatePremiumMembership',authentication.authenticate,controller.updatePremium)

module.exports = route;