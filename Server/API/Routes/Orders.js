const Router = require('express').Router();

const {addNewOrder,updateOrder,getAllOrders,getOrderByUid,deleteOrder} = require('../Controllers/Orders');

Router.post('/',addNewOrder);
Router.put('/:oid',updateOrder);
Router.get('/',getAllOrders);
Router.get('/:uid',getOrderByUid);
Router.delete('/:oid',deleteOrder);




module.exports = Router;