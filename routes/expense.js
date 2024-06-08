const express = require('express');

const authentication = require('../middlewares/authentication');

const route = express.Router();

const expenceController = require('../controllers/expense');

route.get('/getExpences',authentication.authenticate,expenceController.getExpences);
route.post('/postExpence',authentication.authenticate,expenceController.postExpence);
route.delete('/deleteExpence',authentication.authenticate,expenceController.deleteExpence);
route.put('/updateExpence',authentication.authenticate,expenceController.updateExpence);
route.get('/isPremiumUser',authentication.authenticate,expenceController.isPremium);
route.get('/download',authentication.authenticate,expenceController.downloadExpense);
route.get('/reportUrl',authentication.authenticate,expenceController.getUrl);
route.get('/total',authentication.authenticate,expenceController.getTotalExpense);

module.exports = route;