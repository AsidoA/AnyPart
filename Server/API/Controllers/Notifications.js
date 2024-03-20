const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Notifications = require('../Models/Notifications')
const utils = require('../../utils');

require('dotenv').config();
const { ObjectId } = mongoose.Types;
const {clients,createEventStream} = require('../Routes/sseRoute')
const {authenticateToken} = require('../../utils')

module.exports = {
    addNewNotifi: (req, res) => {
        const decodedToken = authenticateToken(req.headers);
        if (decodedToken) {
            const { fullNameShortCut, content, uid, type, oid, titel } = req.body;
            let pickUid
            if (type === 'private')
                pickUid = uid;
            else
                pickUid = new ObjectId(decodedToken.uid)

            const Notification = new Notifications({
                _id: new mongoose.Types.ObjectId(),
                uid: pickUid, fullNameShortCut, content, titel, timestamp: Date.now(), status: [], expiration: null, type, oid
            });

            Notification.save().then(() => {
                if (type === 'private') {
                    utils.getUserById(pickUid)
                        .then(user => {
                            let transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: process.env.PLATFORM,
                                    pass: process.env.PLATFORM_PASS
                                }
                            });


                            let mailOptions = {
                                from: process.env.PLATFORM,
                                to: user[0].email,
                                subject: 'You have got new offer !',
                                html: utils.emailHtml(user[0].user_name,oid)
                            };
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) { return console.log(error); }
                                console.log('Message sent: %s', info.messageId);
                            });
                            clients.forEach(client => {
                                createEventStream(client, 'Update Not');
                            });
                        }).catch(err => { console.log(err); })
                }
                return res.status(200).json({ Msg: 'Notification Added Successfully' });
            }).catch(err => { console.log(err) });
        } else return res.status(401).json({ Msg: "Session Is Expired" });
    },
    updateNotifi: (req, res) => {
        const decodedToken = authenticateToken(req.headers);
        if (decodedToken) {
            if (req.body.status) {
                Notifications.updateOne({ _id: req.params.nid }, { $push: { status: decodedToken.email } }).then(() => {
                    return res.status(200).json({ Msg: "Notification id: " + req.params.nid + " Updated" })
                });
            } else {
                Notifications.updateOne({ _id: req.params.nid }, req.body).then(() => {
                    return res.status(200).json({ Msg: "Notification id: " + req.params.nid + " Updated" })
                });
            }
        } else return res.status(401).json({ Msg: "Session Is Expired" });
    },
    getAllNotifi: (req, res) => {
        const decodedToken = authenticateToken(req.headers);
        if (decodedToken) {
            Notifications.find({ type: 'private/supplier' }).sort({ _id: -1 }).then((notifications) => { return res.status(200).json(notifications) }).catch(err => { console.log(err); });
        } else return res.status(401).json({ Msg: "Session Is Expired" });
    },
    getNotifiById: (req, res) => {
        const decodedToken = authenticateToken(req.headers);
        if (decodedToken) {
            Notifications.find({ uid: decodedToken.uid }).sort({ _id: -1 }).then((notifications) => {
                return res.status(200).json(notifications)
            }).catch(err => { console.log(err); });
        } else return res.status(401).json({ Msg: "Session Is Expired" });
    },
    deleteNotifi: (req, res) => {
        const decodedToken = authenticateToken(req.headers);
        if (decodedToken) {
            Notifications.deleteOne({ _id: req.params.nid }).then(() => {
                return res.status(200).json({ Msg: req.params.nid + ' Deleted' });
            }).catch(err => { console.log(err); });
        } else return res.status(401).json({ Msg: "Session Is Expired" });
    }
};