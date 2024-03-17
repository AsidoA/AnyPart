const Router = require('express').Router();

const {addNewPart,getPartsByCategory,getPartById,getAllParts,updatePart,deletePart} = require('../Controllers/Parts');

Router.post('/',addNewPart)
Router.put('/:pid',updatePart);
Router.get('/',getAllParts);
Router.get('/:cid',getPartsByCategory);
Router.get('/:pid',getPartById);
Router.delete('/:pid',deletePart);


module.exports = Router;