const users = require('../Models/Users');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');
const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {

    Register: (req, res) => {
        const { user_name, phone, email, password, address, city, type } = req.body;
        users.find({ email: email }).then((result) => {
            if (result.length > 0)
                return res.status(409).json({ Msg: "Email Alredy Use" });

            bcrypt.hash(password, 12).then((hashed) => {
                const newUser = new users({
                    _id: new mongoose.Types.ObjectId, user_name, phone, email, password: hashed, address, city, type
                });

                newUser.save().then((user) => {
                    return res.status(200).json({ Msg: 'User Registered Succesfuly' })
                }).catch((error) => { return res.status(505).json({ error }) })
            });
        });
    },
    Login: (req, res) => {
        const { email, password } = req.body;
        users.find({ email: email }).then((result) => {
            if (result.length == 0)
                return res.status(409).json({ Msg: 'User Not Found' });

            bcrypt.compare(password, result[0].password).then((compared) => {
                if (!compared)
                    return res.status(409).json({ Msg: 'Password incorrect' });

                const userDataPayLoad = { uid: result[0]._id, email: email, address: result[0].address, city: result[0].city, type: result[0].type, fullname: result[0].user_name, phone: result[0].phone };
                const token = jwt.sign(userDataPayLoad , process.env.secret_key, {expiresIn: '1h',});
                res.cookie('token', token, { secure: true, httpOnly: true, sameSite:'strict' });

                return res.status(200).json(userDataPayLoad.fullname);
            })
        }).catch((err) => { console.log(err) })
    },
    Logout: (req, res) => {
            res.clearCookie('token');
            return res.status(200).json({ Msg: 'Logged out' });
    }
};