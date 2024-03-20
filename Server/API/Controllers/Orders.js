const mongoose = require('mongoose');
const Orders = require('../Models/Orders');

const { ObjectId } = mongoose.Types;
const {clients,createEventStream} = require('../Routes/sseRoute')
const {authenticateToken} = require('../../utils')



module.exports = {
    addNewOrder: (req, res) => {
        const decodedToken = authenticateToken(req.headers);
        if (decodedToken) {
            const { carDetails, parts, Odate, brandImg, carTitel } = req.body;
            if (parts.length !== 0) {
                const dateObject = new Date(Odate);
                const day = String(dateObject.getDate()).padStart(2, '0');
                const month = String(dateObject.getMonth() + 1).padStart(2, '0');
                const year = dateObject.getFullYear();
                const formattedDate = `${day}/${month}/${year}`;

                const Order = new Orders({
                    _id: new mongoose.Types.ObjectId(),
                    carTitel, carDetails, parts, Uid: new ObjectId(decodedToken.uid), Odate: formattedDate, brandImg, status: [],
                    suplliers: []
                });


                Order.save().then(() => {
                    clients.forEach(client => {
                        createEventStream(client, 'Update Order');
                    });
                    return res.status(200).json(Order._id)
                })
            } else { return res.status(404).json({ Msg: "No Content" }) }
        }
        else return res.status(401).json({ Msg: "Session Is Expired" })
    },
    updateOrder: (req, res) => {
        const decodedToken = authenticateToken(req.headers);
        if (decodedToken) {
            const offer = {
                Oid: req.params.oid,
                Sid: decodedToken.uid,
                Saddress: decodedToken.address,
                Scity: decodedToken.city,
                Semail: decodedToken.email,
                Sfullname: decodedToken.fullname,
                Sphone: decodedToken.phone,
                parts: req.body
            }
            Orders.updateOne(
                { _id: req.params.oid },
                {
                    $push: {
                        suplliers: { $each: [offer] },
                        status: { $each: [decodedToken.email] }
                    }
                }
            ).then(() => {
                clients.forEach(client => {
                    createEventStream(client, 'Update Order');
                });
                return res.status(200).json({ Msg: "Order id: " + req.params.oid + " Updated" });
            }).catch(err => {
                return res.status(500).json({ error: "Internal Server Error" });
            });
        } else return res.status(401).json({ Msg: "Session Is Expired" })
    },
    getAllOrders: (req, res) => {
        const decodedToken = authenticateToken(req.headers);
        if (decodedToken) {
            Orders.find({}).sort({ _id: -1 }).then((orders) => {
                return res.status(200).json(orders)
            })
        } else return res.status(401).json({ Msg: "Session Is Expired" })
    },
    getOrderByUid: (req, res) => {
        const decodedToken = authenticateToken(req.headers);
        if (decodedToken) {
            Orders.find({ Uid: decodedToken.uid }).sort({ _id: -1 }).then((orders) => {
                return res.status(200).json(orders)
            })
        } else return res.status(401).json({ Msg: "Session Is Expired" })
    },
    deleteOrder: (req, res) => {
        const decodedToken = authenticateToken(req.headers);
        if (decodedToken) {
            Orders.deleteOne({ _id: req.params.oid }).then(() => {
                clients.forEach(client => {
                    createEventStream(client, 'Update Order');
                });
                return res.status(200).json({ Msg: "Deleted Order:" + " " + req.params.oid });
            })
        } else return res.status(401).json({ Msg: "Session Is Expired" })
    }
}