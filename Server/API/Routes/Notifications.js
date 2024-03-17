const Router = require('express').Router();

const {addNewNotifi,updateNotifi,getAllNotifi,getNotifiById,deleteNotifi} = require('../Controllers/Notifications');

Router.post('/',addNewNotifi);
Router.put('/:nid',updateNotifi);
Router.get('/',getAllNotifi);
Router.get('/:uid',getNotifiById);
Router.delete('/:nid',deleteNotifi);


module.exports = Router;