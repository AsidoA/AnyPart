const mongoose = require('mongoose');
const Parts = require('../Models/Parts');
const {authenticateToken} = require('../../utils')

module.exports = {
    addNewPart: (req, res) => {
        const decodedToken = authenticateToken(req.headers);
        if (decodedToken) {
            const { name, category } = req.body;

            const Part = new Parts({
                _id: new mongoose.Types.ObjectId(),
                name, condition: 'New', isClicked: false, category, price: 0, notInStock: false
            });

            Part.save().then(() => {
                return res.status(200).json({ Msg: 'Added successfully' })
            }).catch(err => { console.error(err) })
        }
        else return res.status(401).json({ Msg: "Session Is Expired" })
    },
    updatePart: (req, res) => {
        const decodedToken = authenticateToken(req.headers);
        if (decodedToken) {
            if (req.body.category) req.body.category = new mongoose.Types.ObjectId(req.body.category);
            Parts.updateOne({ _id: req.params.pid }, req.body).then(() => {
                return res.status(200).json({ Msg: "Part id: " + req.params.pid + " Updated" });
            });
        } else return res.status(401).json({ Msg: "Session Is Expired" });
    },
    deletePart: (req, res) => {
        const decodedToken = authenticateToken(req.headers);
        if (decodedToken) {
            Parts.updateOne({ _id: req.params.pid }, { $set: { notInStock: true } }).then(() => {
                return res.status(200).json({ Msg: "Part Not In Stock:" + " " + req.params.pid });
            }).catch(err => { console.error(err) })
        } else return res.status(401).json({ Msg: "Session Is Expired" })
    },
    getPartById: (req, res) => {
        Parts.findOne({ _id: req.params.pid }).then((part) => {
            return res.status(200).json(part);
        }).catch((err) => { console.log(err) });
    },
    getPartsByCategory: (req, res) => {

        Parts.aggregate([
            {
                $match: {
                    category: new mongoose.Types.ObjectId(req.params.cid)
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryName'
                }
            }, { $unwind: '$categoryName' },
            {
                $project: {
                    category: 1, categoryName: '$categoryName.name', condition: 1, isClicked: 1, name: 1,
                    price: 1, _id: 1, notInStock: 1, img: 1
                }
            }
        ]).exec().then(products => {
            return res.status(200).json(products);
        }).catch(error => {
            console.error('Error fetching products:', error);
        });
    },
    getAllParts: (req, res) => {

        Parts.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryName'
                }
            }, { $unwind: '$categoryName' },
            {
                $project: {
                    category: 1, categoryName: '$categoryName.name', condition: 1, isClicked: 1, name: 1,
                    price: 1, _id: 1, notInStock: 1, img: 1
                }
            }
        ]).exec().then(products => {
            return res.status(200).json(products);
        }).catch(error => {
            console.error('Error fetching products:', error);
        });
    }
}