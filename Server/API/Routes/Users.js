const Router = require('express').Router();

const {Login,Register,Logout} = require('../Controllers/Users');

Router.post('/log',Login);
Router.post('/reg',Register);
Router.get('/logout',Logout);


module.exports = Router;