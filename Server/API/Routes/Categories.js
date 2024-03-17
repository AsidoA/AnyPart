const Router = require('express').Router();

const {addNewCategory,getAllCategories,getCategoryById,updateCategory,deleteCategory} = require('../Controllers/Categories');

Router.post('/',addNewCategory);
Router.put('/:cid',updateCategory);
Router.get('/',getAllCategories);
Router.get('/:cid',getCategoryById);
Router.delete('/:cid',deleteCategory);


module.exports = Router;