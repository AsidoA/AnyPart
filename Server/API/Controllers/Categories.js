const mongoose = require('mongoose');
const categories = require('../Models/Categories');
const Categories = require('../Models/Categories');

module.exports = {
    addNewCategory: (req, res) => {
        if (req.session.user) {
            const { name } = req.body;

            const Category = new Categories({ _id: new mongoose.Types.ObjectId(), name });

            Category.save().then(() => {
                return res.status(200).json({ Msg: 'Category Added Successfully' });
            }).catch(err => { console.log(err) });

        } else return res.status(401).json({ Msg: "Session Is Expired" });
    },
    updateCategory: (req, res) => {
        if (req.session.user) {
            categories.updateOne({ _id: req.params.cid }, req.body).then(() => {
                return res.status(200).json({ Msg: "Category id: " + req.params.cid + " Updated" });
            });
        } else return res.status(401).json({ Msg: "Session Is Expired" });
    },
    getAllCategories: (req, res) => {
            categories.find({}).sort({name:1}).then((categories) => {
                return res.status(200).json(categories);
            }).catch((err) => { console.log(err) });
    },
    getCategoryById: (req, res) => {
            categories.findOne({ _id: req.params.cid }).then((category) => {
                return res.status(200).json(category);
            }).catch((err) => { console.log(err) });
    },
    deleteCategory: (req, res) => {
        if (req.session.user) {
            categories.deleteOne({ _id: req.params.cid }).then(() => {
                return res.status(200).json({ Msg: req.params.cid + ' Deleted' });
            }).catch(err => { console.log(err); });
        } else return res.status(401).json({ Msg: 'Session Is Expired' })
    }
}