const express = require('express');

const authentication = require('../middleware/authentication');

const route = express.Router();

const expenceController = require('../controller/expence');

route.get('/getExpences',authentication.authenticate,expenceController.getExpences);
route.post('/postExpence',authentication.authenticate,expenceController.postExpence);
route.delete('/deleteExpence',authentication.authenticate,expenceController.deleteExpence);
route.get('/isPremiumUser',authentication.authenticate,expenceController.isPremium);
route.get('/download',authentication.authenticate,expenceController.downloadExpense);
route.get('/reportUrl',authentication.authenticate,expenceController.getUrl)

module.exports = route;