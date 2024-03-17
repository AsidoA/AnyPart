const Router = require('express').Router();

const {getUserCookie} = require('../Controllers/Cookies');

Router.get('/',getUserCookie);



module.exports = Router;