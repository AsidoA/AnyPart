const Router = require('express').Router();

const {addNewGarage,updateGarage,getGarages,deleteGarage} = require('../Controllers/Garages');

Router.post('/',addNewGarage);
Router.put('/:gid',updateGarage);
Router.get('/',getGarages);
Router.delete('/:gid',deleteGarage);

module.exports = Router;