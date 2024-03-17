const mongoose = require('mongoose');
const Orders = require('../Models/Orders');

const { ObjectId } = mongoose.Types;
const {clients,createEventStream} = require('../Routes/sseRoute')



module.exports = {
    addNewOrder: (req, res) => {
        
        if (req.session.user) {
            const { carDetails, parts, Odate, brandImg, carTitel } = req.body;
            if (parts.length !== 0) {
                const dateObject = new Date(Odate);
                const day = String(dateObject.getDate()).padStart(2, '0');
                const month = String(dateObject.getMonth() + 1).padStart(2, '0');
                const year = dateObject.getFullYear();
                const formattedDate = `${day}/${month}/${year}`;

                const Order = new Orders({
                    _id: new mongoose.Types.ObjectId(),
                    carTitel, carDetails, parts, Uid: new ObjectId(req.session.user.uid), Odate: formattedDate, brandImg, status: [],
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
        if (req.session.user) {
            const offer = {
                Oid: req.params.oid,
                Sid: req.session.user.uid,
                Saddress: req.session.user.address,
                Scity: req.session.user.city,
                Semail: req.session.user.email,
                Sfullname: req.session.user.fullname,
                Sphone: req.session.user.phone,
                parts: req.body
            }
            Orders.updateOne(
                { _id: req.params.oid },
                {
                    $push: {
                        suplliers: { $each: [offer] },
                        status: { $each: [req.session.user.email] }
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
        if (req.session.user) {
            Orders.find({}).sort({ _id: -1 }).then((orders) => {
                return res.status(200).json(orders)
            })
        } else return res.status(401).json({ Msg: "Session Is Expired" })
    },
    getOrderByUid: (req, res) => {
        if (req.session.user) {
            Orders.find({ Uid: req.session.user.uid }).sort({ _id: -1 }).then((orders) => {
                return res.status(200).json(orders)
            })
        } else return res.status(401).json({ Msg: "Session Is Expired" })
    },
    deleteOrder: (req, res) => {
        if (req.session.user) {
            Orders.deleteOne({ _id: req.params.oid }).then(() => {
                clients.forEach(client => {
                    createEventStream(client, 'Update Order');
                });
                return res.status(200).json({ Msg: "Deleted Order:" + " " + req.params.oid });
            })
        } else return res.status(401).json({ Msg: "Session Is Expired" })
    }
}